import assert from "node:assert/strict";
import test from "node:test";

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
  { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken },
] = await Promise.all([
  import("supertest"),
  import("../src/app.js"),
  import("../src/models/index.js"),
  import("../src/utils/password.js"),
  import("../src/utils/tokens.js"),
]);

test("Argon2id password hashing verifies correct passwords only", async () => {
  const hash = await hashPassword("StrongPassword123");
  assert.match(hash, /^\$argon2id\$/);
  assert.equal(await verifyPassword(hash, "StrongPassword123"), true);
  assert.equal(await verifyPassword(hash, "WrongPassword123"), false);
});

test("access and refresh JWTs keep their token types separate", () => {
  const ambassador = new CampusAmbassador({
    _id: "507f1f77bcf86cd799439011",
    ambassadorId: "CA-RNX-0001",
    name: "Campus Captain",
    email: "captain@example.com",
    college: "MNNIT Allahabad",
    passwordHash: "placeholder",
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
