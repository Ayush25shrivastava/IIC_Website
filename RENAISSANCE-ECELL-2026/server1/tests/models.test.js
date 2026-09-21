import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";

process.env.NODE_ENV = "test";
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/renaissance_server1_test";
process.env.JWT_ACCESS_SECRET = "test-access-secret-that-is-at-least-32-characters-long";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-that-is-at-least-32-characters-long";

const [
  { AMBASSADOR_STATUS, DISCOUNT_TYPE, REGISTRATION_STATUS, TASK_STATUS },
  { AuthSession, CampusAmbassador, PromoCode, Registration, Task },
] = await Promise.all([
  import("../src/constants/domain.js"),
  import("../src/models/index.js"),
]);

const objectId = () => new mongoose.Types.ObjectId();

function buildRegistration(overrides = {}) {
  return new Registration({
    registrationId: "RNX-REG-00001",
    name: "Test Participant",
    email: "participant@example.com",
    phone: "+91 9876543210",
    college: "MNNIT Allahabad",
    packageId: objectId(),
    packageCode: "EVENT-BOTH-DAYS",
    packageName: "Event Ticket - Both Days",
    baseAmountPaise: 150000,
    discountAmountPaise: 0,
    finalAmountPaise: 150000,
    ...overrides,
  });
}

test("CampusAmbassador normalizes identifiers and has safe defaults", async () => {
  const ambassador = new CampusAmbassador({
    ambassadorId: "ca-rnx-0001",
    name: "Campus Captain",
    email: "CAPTAIN@EXAMPLE.COM",
    college: "MNNIT Allahabad",
    passwordHash: "argon2id-hash-placeholder",
  });

  await ambassador.validate();

  assert.equal(ambassador.ambassadorId, "CA-RNX-0001");
  assert.equal(ambassador.email, "captain@example.com");
  assert.equal(ambassador.status, AMBASSADOR_STATUS.ACTIVE);
  assert.equal(ambassador.mustChangePassword, true);
});

test("PromoCode rejects invalid percentage discounts", async () => {
  const promo = new PromoCode({
    code: "CAPTAIN26",
    ambassadorId: objectId(),
    discountType: DISCOUNT_TYPE.PERCENTAGE,
    discountValue: 125,
  });

  await assert.rejects(promo.validate(), /percentage discount cannot exceed 100/);
});

test("Task defaults to ASSIGNED for a campus ambassador", async () => {
  const task = new Task({
    taskId: "TASK-RNX-0001",
    title: "Promote Renaissance 2026",
    description: "Share official Renaissance creatives across the campus.",
    ambassadorId: objectId(),
  });

  await task.validate();
  assert.equal(task.status, TASK_STATUS.ASSIGNED);
});

test("Registration requires complete immutable promo attribution", async () => {
  const registration = buildRegistration({
    promoCode: "CAPTAIN26",
  });

  await assert.rejects(
    registration.validate(),
    /promoCodeId, promoCode and ambassadorId must be stored together/,
  );
});

test("Registration stores a valid ambassador referral snapshot", async () => {
  const registration = buildRegistration({
    promoCodeId: objectId(),
    promoCode: "CAPTAIN26",
    ambassadorId: objectId(),
    promoDiscountType: DISCOUNT_TYPE.PERCENTAGE,
    promoDiscountValue: 10,
    discountAmountPaise: 15000,
    finalAmountPaise: 135000,
  });

  await registration.validate();

  assert.equal(registration.status, REGISTRATION_STATUS.PENDING_VERIFICATION);
  assert.equal(registration.promoCode, "CAPTAIN26");
  assert.equal(registration.finalAmountPaise, 135000);
});

test("Registration rejects inconsistent backend-calculated amounts", async () => {
  const registration = buildRegistration({ finalAmountPaise: 149999 });

  await assert.rejects(
    registration.validate(),
    /finalAmountPaise must equal baseAmountPaise minus discountAmountPaise/,
  );
});

test("critical database identifiers have unique indexes", () => {
  const indexes = {
    authSessions: AuthSession.schema.indexes(),
    ambassadors: CampusAmbassador.schema.indexes(),
    promos: PromoCode.schema.indexes(),
    tasks: Task.schema.indexes(),
    registrations: Registration.schema.indexes(),
  };

  const hasUniqueIndex = (entries, field) =>
    entries.some(([definition, options]) => definition[field] === 1 && options.unique === true);

  assert.equal(hasUniqueIndex(indexes.authSessions, "sessionId"), true);
  assert.equal(hasUniqueIndex(indexes.ambassadors, "ambassadorId"), true);
  assert.equal(hasUniqueIndex(indexes.ambassadors, "email"), true);
  assert.equal(hasUniqueIndex(indexes.promos, "code"), true);
  assert.equal(hasUniqueIndex(indexes.tasks, "taskId"), true);
  assert.equal(hasUniqueIndex(indexes.registrations, "registrationId"), true);
  assert.equal(hasUniqueIndex(indexes.registrations, "transactionId"), true);
  assert.equal(hasUniqueIndex(indexes.registrations, "ticketId"), true);
});


test("CampusAmbassador authVersion defaults to zero and remains private in JSON", async () => {
  const ambassador = new CampusAmbassador({
    ambassadorId: "CA-RNX-0002",
    name: "Second Captain",
    email: "second@example.com",
    college: "MNNIT Allahabad",
    passwordHash: "argon2id-hash-placeholder",
  });

  await ambassador.validate();
  assert.equal(ambassador.authVersion, 0);
  assert.equal(Object.hasOwn(ambassador.toJSON(), "authVersion"), false);
  assert.equal(Object.hasOwn(ambassador.toJSON(), "passwordHash"), false);
});
