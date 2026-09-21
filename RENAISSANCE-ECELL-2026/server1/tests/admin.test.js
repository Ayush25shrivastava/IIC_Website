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
  { createAmbassadorSchema, createPromoSchema, taskListAdminQuerySchema },
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
