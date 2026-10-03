import assert from "node:assert/strict";
import test from "node:test";
import express from "express";

process.env.NODE_ENV = "test";
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/renaissance_server1_test";
process.env.JWT_ACCESS_SECRET = "test-access-secret-that-is-at-least-32-characters-long";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-that-is-at-least-32-characters-long";
process.env.AUTH_COOKIE_SECURE = "false";

const [
  { default: request },
  { app },
  { CampusAmbassador },
  { hashPassword, verifyPassword },
  { verifyAmbassadorPassword },
  { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken },
] = await Promise.all([
  import("supertest"),
  import("../src/app.js"),
  import("../src/models/index.js"),
  import("../src/utils/password.js"),
  import("../src/services/ambassador-auth.service.js"),
  import("../src/utils/tokens.js"),
]);

const { authRateLimiter } = await import("../src/routes/ambassador-auth.routes.js");

function rateLimitTestApp(countOnlyFailures = true) {
  const testApp = express();
  testApp.post("/login", authRateLimiter({
    limit: 2,
    code: "LOGIN_RATE_LIMITED",
    message: "Too many unsuccessful login attempts.",
    countOnlyFailures,
  }), (req, res) => res.sendStatus(Number(req.query.status) || 200));
  testApp.use((error, _req, res, _next) => {
    res.status(error.statusCode).json({ code: error.code, message: error.message, details: error.details });
  });
  return testApp;
}

test("successful logins and server failures do not exhaust login attempts", async () => {
  const testApp = rateLimitTestApp();
  for (const status of [200, 200, 200, 503, 500, 503, 200]) {
    await request(testApp).post(`/login?status=${status}`).expect(status);
  }
  await request(testApp).post("/login?status=401").expect(401);
  await request(testApp).post("/login?status=401").expect(401);
  const blocked = await request(testApp).post("/login").expect(429);
  assert.equal(blocked.body.code, "LOGIN_RATE_LIMITED");
  assert.ok(blocked.body.details.retryAfterSeconds > 0);
  assert.equal(Number(blocked.headers["retry-after"]), blocked.body.details.retryAfterSeconds);
  assert.match(blocked.body.message, /Try again in \d+ minutes?\./);
});

test("successful login does not erase previous incorrect attempts", async () => {
  const testApp = rateLimitTestApp();
  await request(testApp).post("/login?status=401").expect(401);
  await request(testApp).post("/login?status=200").expect(200);
  await request(testApp).post("/login?status=400").expect(400);
  await request(testApp).post("/login").expect(429);
});

test("refresh rate limiting continues counting all requests", async () => {
  const testApp = rateLimitTestApp(false);
  await request(testApp).post("/login").expect(200);
  await request(testApp).post("/login").expect(200);
  await request(testApp).post("/login").expect(429);
});

test("Argon2id password hashing verifies correct passwords only", async () => {
  const hash = await hashPassword("StrongPassword123");
  assert.match(hash, /^\$argon2id\$/);
  assert.equal(await verifyPassword(hash, "StrongPassword123"), true);
  assert.equal(await verifyPassword(hash, "WrongPassword123"), false);
});

test("ambassador password matching prefers the readable field and supports legacy hashes", async () => {
  const password = "TestCaptain2026!";
  const passwordHash = await hashPassword("OldCaptain2026!");
  assert.equal(await verifyAmbassadorPassword({ password }, password), true);
  assert.equal(await verifyAmbassadorPassword({ password }, "testCaptain2026!"), false);
  assert.equal(await verifyAmbassadorPassword({ password }, `${password} `), false);
  assert.equal(await verifyAmbassadorPassword({ passwordHash }, "OldCaptain2026!"), true);
  assert.equal(await verifyAmbassadorPassword({ password, passwordHash }, "OldCaptain2026!"), false);
  assert.equal(await verifyAmbassadorPassword({ password, passwordHash }, password), true);
  assert.equal(await verifyAmbassadorPassword({}, password), false);
});

test("access and refresh JWTs keep their token types separate", () => {
  const ambassador = new CampusAmbassador({
    _id: "507f1f77bcf86cd799439011",
    ambassadorId: "CA-RNX-0001",
    name: "Campus Captain",
    email: "captain@example.com",
    college: "MNNIT Allahabad",
    password: "TestCaptain2026!",
    authVersion: 3,
  });

  const access = verifyAccessToken(signAccessToken(ambassador));
  const refresh = verifyRefreshToken(signRefreshToken(ambassador, "session-1"));

  assert.equal(access.typ, "access");
  assert.equal(access.ver, 3);
  assert.equal(refresh.typ, "refresh");
  assert.equal(refresh.sid, "session-1");
});

test("invalid ambassador login payload is rejected before database access", async () => {
  const response = await request(app)
    .post("/api/v1/ambassador/auth/login")
    .set("Origin", "http://localhost:5173")
    .send({ email: "not-an-email", password: "" })
    .expect(400);

  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, "VALIDATION_ERROR");
});

test("ambassador /me requires authentication", async () => {
  const response = await request(app).get("/api/v1/ambassador/auth/me").expect(401);
  assert.equal(response.body.error.code, "AUTH_REQUIRED");
});

test("change-password enforces password policy before database access", async () => {
  const response = await request(app)
    .post("/api/v1/ambassador/auth/change-password")
    .set("Origin", "http://localhost:5173")
    .send({ currentPassword: "old", newPassword: "weak" })
    .expect(401);

  // Authentication intentionally runs before body validation on protected routes.
  assert.equal(response.body.error.code, "AUTH_REQUIRED");
});

test("signed-out visitors can clear cookies while the database is offline", async () => {
  for (const cookies of [[], ["rn_access=invalid", "rn_refresh=invalid"]]) {
    const response = await request(app)
      .post("/api/v1/ambassador/auth/logout")
      .set("Origin", "http://localhost:5173")
      .set("Cookie", cookies)
      .expect(200);
    assert.equal(response.body.success, true);
    assert.ok(response.headers["set-cookie"].some((cookie) => cookie.startsWith("rn_access=;")));
    assert.ok(response.headers["set-cookie"].some((cookie) => cookie.startsWith("rn_refresh=;")));
  }
});

test("logout of a valid session still requires database revocation", async () => {
  const ambassador = new CampusAmbassador({
    _id: "507f1f77bcf86cd799439011",
    ambassadorId: "CA-RNX-0001",
    role: "CAMPUS_AMBASSADOR",
  });
  const token = signAccessToken(ambassador, "offline-session-test");
  const response = await request(app)
    .post("/api/v1/ambassador/auth/logout")
    .set("Origin", "http://localhost:5173")
    .set("Cookie", `rn_access=${token}`)
    .expect(503);
  assert.equal(response.body.error.code, "DATABASE_UNAVAILABLE");
  assert.equal(response.headers["set-cookie"], undefined);
});

test("signed-out logout still rejects untrusted origins", async () => {
  const response = await request(app)
    .post("/api/v1/ambassador/auth/logout")
    .set("Origin", "https://untrusted.example")
    .expect(403);
  assert.equal(response.body.success, false);
});
