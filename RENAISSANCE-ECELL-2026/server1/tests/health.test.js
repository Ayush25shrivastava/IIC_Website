import test from "node:test";
import assert from "node:assert/strict";

process.env.NODE_ENV = "test";
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/renaissance_server1_test";
process.env.JWT_ACCESS_SECRET = "test-access-secret-that-is-at-least-32-characters-long";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-that-is-at-least-32-characters-long";

const [{ default: request }, { app }] = await Promise.all([
  import("supertest"),
  import("../src/app.js"),
]);

test("GET / returns API service information", async () => {
  const response = await request(app).get("/").expect(200);

  assert.equal(response.body.success, true);
  assert.equal(response.body.service, "renaissance-server1");
  assert.equal(response.body.status, "ok");
  assert.equal(response.body.apiVersion, "v1");
  assert.equal(response.body.endpoints.health, "/api/v1/health");
  assert.ok(response.body.requestId);
});

test("GET /api/v1/health returns service health", async () => {
  const response = await request(app).get("/api/v1/health").expect(200);

  assert.equal(response.body.success, true);
  assert.equal(response.body.status, "ok");
  assert.equal(response.body.service, "renaissance-server1");
});

test("GET /api/v1/ready returns 503 when MongoDB is not connected", async () => {
  const response = await request(app).get("/api/v1/ready").expect(503);

  assert.equal(response.body.success, false);
  assert.equal(response.body.status, "not_ready");
  assert.equal(response.body.checks.database.ready, false);
});

test("unknown API route returns the standard error envelope", async () => {
  const response = await request(app).get("/api/v1/does-not-exist").expect(404);

  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, "ROUTE_NOT_FOUND");
  assert.ok(response.body.error.requestId);
});
