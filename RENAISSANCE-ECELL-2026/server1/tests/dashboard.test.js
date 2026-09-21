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
  { TASK_STATUS },
  {
    ambassadorReferralListQuerySchema,
    ambassadorTaskDetailsSchema,
    ambassadorTaskListQuerySchema,
    taskIdParamsSchema,
  },
  { assertTaskStatusTransition, publicReferral },
] = await Promise.all([
  import("supertest"),
  import("../src/app.js"),
  import("../src/constants/domain.js"),
  import("../src/validators/ambassador-dashboard.schemas.js"),
  import("../src/services/ambassador-dashboard.service.js"),
]);

test("ambassador dashboard routes require authentication", async () => {
  for (const path of [
    "/api/v1/ambassador/dashboard",
    "/api/v1/ambassador/promo-code",
    "/api/v1/ambassador/tasks",
    "/api/v1/ambassador/referrals",
  ]) {
    const response = await request(app).get(path).expect(401);
    assert.equal(response.body.error.code, "AUTH_REQUIRED");
  }
});

test("task list query applies bounded pagination defaults", () => {
  const parsed = ambassadorTaskListQuerySchema.parse({});
  assert.deepEqual(parsed, { page: 1, limit: 20 });

  assert.throws(() => ambassadorTaskListQuerySchema.parse({ limit: "51" }));
});

test("referral query validates known registration statuses", () => {
  const parsed = ambassadorReferralListQuerySchema.parse({
    page: "2",
    limit: "10",
    status: "VERIFIED",
  });

  assert.equal(parsed.page, 2);
  assert.equal(parsed.limit, 10);
  assert.equal(parsed.status, "VERIFIED");
  assert.throws(() => ambassadorReferralListQuerySchema.parse({ status: "PAIDISH" }));
});

test("task ID validation normalizes input to uppercase", () => {
  const parsed = taskIdParamsSchema.parse({ taskId: "task-rnx-0001" });
  assert.equal(parsed.taskId, "TASK-RNX-0001");
});

test("task details require at least one editable field", () => {
  assert.throws(() => ambassadorTaskDetailsSchema.parse({}));
  assert.equal(
    ambassadorTaskDetailsSchema.parse({ remarks: "Shared posters with the campus club." }).remarks,
    "Shared posters with the campus club.",
  );
});

test("ambassadors cannot regress completed task status", () => {
  assert.doesNotThrow(() =>
    assertTaskStatusTransition(TASK_STATUS.ASSIGNED, TASK_STATUS.IN_PROGRESS),
  );
  assert.doesNotThrow(() =>
    assertTaskStatusTransition(TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED),
  );

  assert.throws(
    () => assertTaskStatusTransition(TASK_STATUS.COMPLETED, TASK_STATUS.IN_PROGRESS),
    (error) => error.code === "INVALID_TASK_STATUS_TRANSITION" && error.statusCode === 409,
  );
});

test("referral API representation does not expose payment or contact data", () => {
  const referral = publicReferral({
    _id: { toString: () => "registration-object-id" },
    registrationId: "RNX-TEST-0001",
    name: "Aayush Example",
    email: "private@example.com",
    phone: "+919999999999",
    packageCode: "EVENT-2D",
    packageName: "Event Ticket",
    promoCode: "CAPTAIN26",
    status: "VERIFIED",
    transactionId: "SECRET-TXN",
    paymentScreenshot: { url: "https://private.invalid/payment.png" },
    createdAt: new Date("2026-09-21T00:00:00.000Z"),
  });

  assert.equal(referral.participantName, "Aayush");
  assert.equal("email" in referral, false);
  assert.equal("phone" in referral, false);
  assert.equal("transactionId" in referral, false);
  assert.equal("paymentScreenshot" in referral, false);
});
