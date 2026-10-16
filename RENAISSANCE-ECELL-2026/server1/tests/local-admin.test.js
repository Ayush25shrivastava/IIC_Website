import assert from "node:assert/strict";
import test from "node:test";
import { createLocalTeamPhotoApi, isLocalAdminLocation } from "../../client/src/lib/local-admin.js";

test("login-free admin is limited to local development", () => {
  assert.equal(isLocalAdminLocation(true, "localhost"), true);
  assert.equal(isLocalAdminLocation(true, "127.0.0.1"), true);
  assert.equal(isLocalAdminLocation(true, "[::1]"), true);
  assert.equal(isLocalAdminLocation(false, "localhost"), false);
  assert.equal(isLocalAdminLocation(true, "example.com"), false);
  assert.equal(isLocalAdminLocation(true, "localhost", "false"), false);
});

test("team photo changes persist across local portal reloads without a backend", async () => {
  const saved = new Map();
  const storage = { getItem: (key) => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) };
  const portal = createLocalTeamPhotoApi(storage);
  assert.equal((await portal.teamPhotos()).members.length, 2);
  const { member } = await portal.createTeamPhoto({ name: "Student", category: "fourth", image_url: "data:image/jpeg;base64,/9j/" });
  const reloaded = createLocalTeamPhotoApi(storage);
  assert((await reloaded.teamPhotos()).members.some((item) => item.id === member.id));
  await reloaded.updateTeamPhoto(member.id, { name: "Updated Student", category: "third" });
  const updated = (await portal.teamPhotos()).members.find((item) => item.id === member.id);
  assert.equal(updated.name, "Updated Student");
  assert.equal(updated.image_url, member.image_url);
  for (const item of (await portal.teamPhotos()).members) await reloaded.deleteTeamPhoto(item.id);
  assert.deepEqual((await createLocalTeamPhotoApi(storage).teamPhotos()).members, []);
});

test("browser storage errors are surfaced instead of claiming photos were saved", async () => {
  const portal = createLocalTeamPhotoApi({ getItem: () => null, setItem: () => { throw new Error("QuotaExceededError"); } });
  await assert.rejects(portal.createTeamPhoto({ name: "Student" }), /storage is full or unavailable/);
});
