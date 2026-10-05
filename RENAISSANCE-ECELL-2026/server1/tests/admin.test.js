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
  { Admin, AdminAuthSession },
  { signAdminAccessToken, signAdminRefreshToken, verifyAdminAccessToken, verifyAdminRefreshToken },
  { createAmbassadorSchema, createPromoSchema, createTaskSchema, updateTaskAdminSchema, taskListAdminQuerySchema },
] = await Promise.all([
  import("supertest"),
  import("../src/app.js"),
  import("../src/models/index.js"),
  import("../src/utils/admin-tokens.js"),
  import("../src/validators/admin-management.schemas.js"),
]);

test("admin management routes require admin authentication", async () => {
  for (const path of [
    "/api/v1/admin/dashboard",
    "/api/v1/admin/ambassadors",
    "/api/v1/admin/promo-codes",
    "/api/v1/admin/tasks",
    "/api/v1/admin/referrals",
  ]) {
    const response = await request(app).get(path).expect(401);
    assert.equal(response.body.error.code, "ADMIN_AUTH_REQUIRED");
  }
});

test("admin JWTs are isolated from ambassador token types", () => {
  const admin = new Admin({
    _id: "507f1f77bcf86cd799439011",
    adminId: "AD-RNX-0001",
    name: "Main Admin",
    email: "admin@example.com",
    passwordHash: "placeholder",
    authVersion: 2,
  });
  const access = verifyAdminAccessToken(signAdminAccessToken(admin));
  const refresh = verifyAdminRefreshToken(signAdminRefreshToken(admin, "admin-session"));
  assert.equal(access.typ, "admin_access");
  assert.equal(access.ver, 2);
  assert.equal(refresh.typ, "admin_refresh");
  assert.equal(refresh.sid, "admin-session");
});

test("valid admin requests fail promptly when the database is unavailable", async () => {
  const admin = new Admin({ _id: "507f1f77bcf86cd799439011", authVersion: 0 });
  const token = signAdminAccessToken(admin, "test-database-unavailable");
  const response = await request(app).get("/api/v1/admin/dashboard")
    .set("Authorization", `Bearer ${token}`).expect(503);
  assert.equal(response.body.error.code, "DATABASE_UNAVAILABLE");
});

test("invalid admin login input is validated before database access", async () => {
  const response = await request(app).post("/api/v1/admin/auth/login")
    .set("Origin", "http://localhost:5173").send({ email: "invalid", password: "" }).expect(400);
  assert.equal(response.body.error.code, "VALIDATION_ERROR");
});

test("ambassador creation validation normalizes identity fields", () => {
  const parsed = createAmbassadorSchema.parse({
    ambassadorId: "ca-rnx-0042",
    name: "Campus Captain",
    email: "CAPTAIN@EXAMPLE.COM",
    college: "MNNIT Allahabad",
  });
  assert.equal(parsed.ambassadorId, "CA-RNX-0042");
  assert.equal(parsed.email, "captain@example.com");
});

test("admin-chosen ambassador passwords preserve input and reject invalid values", () => {
  const profile = { name: "Captain", email: "captain@example.test", college: "Test College" };
  const password = " captain2026 ";
  assert.equal(createAmbassadorSchema.parse({ ...profile, password }).password, password);
  for (const invalid of ["", "short", "        ", "a".repeat(129), null]) {
    assert.throws(() => createAmbassadorSchema.parse({ ...profile, password: invalid }));
  }
  assert.equal(createAmbassadorSchema.parse(profile).password, undefined);
});

test("promo validation rejects malformed codes", () => {
  assert.throws(() => createPromoSchema.parse({
    code: "bad code",
    ambassadorId: "507f1f77bcf86cd799439011",
  }));
});

test("admin task list pagination is bounded", () => {
  assert.deepEqual(taskListAdminQuerySchema.parse({}), { page: 1, limit: 20 });
  assert.throws(() => taskListAdminQuerySchema.parse({ limit: "101" }));
});

test("admin task deadlines accept an ISO date or null and reject invalid input", () => {
  const input = {
    title: "Share event posters", description: "Share with your college club.",
    ambassadorId: "507f1f77bcf86cd799439011", dueAt: "2026-10-01T12:00:00.000Z",
  };
  assert.equal(createTaskSchema.parse(input).dueAt, input.dueAt);
  assert.equal(createTaskSchema.parse({ ...input, dueAt: null }).dueAt, null);
  assert.deepEqual(updateTaskAdminSchema.parse({ dueAt: null }), { dueAt: null });
  assert.throws(() => createTaskSchema.parse({ ...input, dueAt: "tomorrow" }));
  assert.throws(() => updateTaskAdminSchema.parse({ dueAt: "2026-02-30T12:00:00Z" }));
  assert.throws(() => updateTaskAdminSchema.parse({}));
});


test("admin identity and session indexes enforce uniqueness and expiry", () => {
  const adminIndexes = Admin.schema.indexes();
  const sessionIndexes = AdminAuthSession.schema.indexes();

  assert.equal(
    adminIndexes.some(([keys, options]) => keys.adminId === 1 && options.unique === true),
    true,
  );
  assert.equal(
    adminIndexes.some(([keys, options]) => keys.email === 1 && options.unique === true),
    true,
  );
  assert.equal(
    sessionIndexes.some(([keys, options]) => keys.expiresAt === 1 && options.expireAfterSeconds === 0),
    true,
  );
});
