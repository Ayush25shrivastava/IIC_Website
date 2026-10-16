import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

Object.assign(process.env, { NODE_ENV: "development", MONGODB_URI: "mongodb://127.0.0.1:27017/test", CLIENT_ORIGIN: "http://localhost:5173", JWT_ACCESS_SECRET: "test-access-secret-that-is-at-least-32-characters", JWT_REFRESH_SECRET: "test-refresh-secret-that-is-at-least-32-characters", LOCAL_TEAM_PHOTO_ADMIN: "true" });
const { createCloudinaryTeamPhotoService, cloudinaryTeamPhotos } = await import("../src/services/cloudinary-team-photo.service.js");
const { requireLocalTeamPhotoAdmin } = await import("../src/middleware/local-team-photo-admin.js");
const config = { CLOUDINARY_CLOUD_NAME: "fbf4uyoz", CLOUDINARY_API_KEY: "test-key", CLOUDINARY_API_SECRET: "test-secret" };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
const resource = (id, name = "Student") => ({ public_id: `renaissance/team/${id}`, secure_url: `https://res.cloudinary.com/fbf4uyoz/image/upload/v1/renaissance/team/${id}.jpg`, version: 1, context: { custom: { name, category: "fourth" } } });

test("Cloudinary lists every page and fetches fresh on each request", async () => {
  const urls = [];
  const service = createCloudinaryTeamPhotoService(config, async (url, options) => {
    urls.push(url);
    assert.equal(options.cache, "no-store");
    assert.match(options.headers.Authorization, /^Basic /);
    return url.includes("next_cursor=") ? json({ resources: [resource("second")] }) : json({ resources: [resource("first")], next_cursor: "next-page" });
  });
  assert.equal((await service.list()).length, 2);
  assert.equal((await service.list()).length, 2);
  assert.equal(urls.length, 4);
  assert(urls[0].includes("context=true"));
});

test("cropped uploads are signed on the server and return Cloudinary URLs", async () => {
  const service = createCloudinaryTeamPhotoService(config, async (url, options) => {
    assert(url.endsWith("/image/upload"));
    const params = Object.fromEntries(options.body.entries());
    assert.equal(params.file, "data:image/jpeg;base64,/9j/");
    assert.equal(params.overwrite, "false");
    assert.equal(params.tags, "renaissance_team_photos");
    assert(params.context.includes("name=Student\\|One\\=Two"));
    const signed = Object.keys(params).filter((key) => !["file", "api_key", "signature"].includes(key)).sort().map((key) => `${key}=${params[key]}`).join("&");
    assert.equal(params.signature, createHash("sha256").update(signed + config.CLOUDINARY_API_SECRET).digest("hex"));
    assert(!JSON.stringify(params).includes(config.CLOUDINARY_API_SECRET));
    return json({ ...resource(params.public_id.split("/").at(-1)), context: undefined });
  });
  const member = await service.create({ name: "Student|One=Two", category: "fourth", image_url: "data:image/jpeg;base64,/9j/" });
  assert.match(member.image_url, /^https:\/\/res.cloudinary.com\/fbf4uyoz\//);
  assert.equal(member.name, "Student|One=Two");
});

test("metadata edits retain the existing image and import retries do not overwrite it", async () => {
  const actions = [];
  const service = createCloudinaryTeamPhotoService(config, async (url, options) => {
    actions.push(url);
    if (url.includes("/resources/")) return json(resource("existing"));
    assert(url.endsWith("/image/explicit"));
    assert.equal(options.body.get("file"), null);
    return json(resource("existing"));
  });
  await service.update("existing", { name: "Updated", category: "third" });
  await service.import("existing", { name: "Old browser copy", image_url: "https://example.com/old.jpg" });
  assert.equal(actions.length, 3);
  assert(!actions.some((url) => url.endsWith("/image/upload")));
});

test("deletion is scoped to team images and invalidates cached copies", async () => {
  const service = createCloudinaryTeamPhotoService(config, async (_url, options) => {
    assert.equal(options.body.get("public_id"), "renaissance/team/member");
    assert.equal(options.body.get("invalidate"), "true");
    return json({ result: "ok" });
  });
  await service.remove("member");
  await assert.rejects(service.remove("../../sponsor"), { code: "INVALID_TEAM_PHOTO_ID" });
});

test("missing credentials and provider failures are reported without exposing secrets", async () => {
  await assert.rejects(createCloudinaryTeamPhotoService({ ...config, CLOUDINARY_API_KEY: "" }).list(), { code: "CLOUDINARY_NOT_CONFIGURED" });
  const service = createCloudinaryTeamPhotoService(config, async () => json({ error: { message: config.CLOUDINARY_API_SECRET } }, 401));
  await assert.rejects(service.list(), (error) => error.code === "CLOUDINARY_AUTH_FAILED" && !error.message.includes(config.CLOUDINARY_API_SECRET));
});

test("local cloud writes require loopback, a trusted localhost origin, and localhost host", () => {
  const req = { socket: { remoteAddress: "127.0.0.1" }, hostname: "localhost", get: () => "http://localhost:5173" };
  let error;
  requireLocalTeamPhotoAdmin(req, {}, (value) => { error = value; });
  assert.equal(error, undefined);
  for (const bad of [{ ...req, socket: { remoteAddress: "192.168.1.10" } }, { ...req, get: () => undefined }, { ...req, hostname: "attacker.example" }, { ...req, get: () => "https://attacker.example" }]) {
    requireLocalTeamPhotoAdmin(bad, {}, (value) => { error = value; });
    assert.equal(error.statusCode, 403);
  }
});

test("local photo API saves to the cloud service and public pages read it without MongoDB", async (t) => {
  const { default: request } = await import("supertest");
  const { app } = await import("../src/app.js");
  const members = [];
  t.mock.method(cloudinaryTeamPhotos, "list", async () => [...members]);
  t.mock.method(cloudinaryTeamPhotos, "create", async (body) => { const member = { ...body, id: "test", image_url: resource("test").secure_url }; members.push(member); return member; });
  t.mock.method(cloudinaryTeamPhotos, "remove", async () => { members.splice(0); });
  const body = { name: "Student", category: "fourth", image_url: "https://example.com/photo.jpg" };
  const created = await request(app).post("/api/v1/local-admin/team-photos").set("Origin", "http://localhost:5173").set("Host", "localhost:5008").send(body).expect(201);
  assert.equal(created.body.data.member.image_url, resource("test").secure_url);
  const list = await request(app).get("/api/v1/team-photos").expect(200);
  assert.equal(list.headers["cache-control"], "no-store");
  assert.equal(list.body.data.members.length, 1);
  await request(app).post("/api/v1/local-admin/team-photos").set("Host", "localhost:5008").send(body).expect(403);
  await request(app).delete("/api/v1/local-admin/team-photos/test").set("Origin", "http://localhost:5173").set("Host", "localhost:5008").expect(204);
  assert.equal((await request(app).get("/api/v1/team-photos")).body.data.members.length, 0);
  await request(app).post("/api/v1/admin/team-photos").send(body).expect(401);
});
