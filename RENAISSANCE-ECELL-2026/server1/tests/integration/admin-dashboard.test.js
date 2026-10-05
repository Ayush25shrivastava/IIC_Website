import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";

const uri = process.env.MONGODB_TEST_URI;
test("admin dashboard database and authorization flow", { skip: !uri }, async (t) => {
  Object.assign(process.env, { NODE_ENV: "test", MONGODB_URI: uri, CLIENT_ORIGIN: "http://localhost:5173", JWT_ACCESS_SECRET: "integration-access-secret-at-least-32-characters", JWT_REFRESH_SECRET: "integration-refresh-secret-at-least-32-characters", AUTH_COOKIE_SECURE: "false" });
  const [{ default: mongoose }, { default: request }, { app }, models, { hashPassword }, { logger }] = await Promise.all([
    import("mongoose"), import("supertest"), import("../../src/app.js"), import("../../src/models/index.js"), import("../../src/utils/password.js"), import("../../src/utils/logger.js"),
  ]);
  logger.level = "silent";
  await mongoose.connect(uri, { dbName: `renaissance_admin_test_${randomUUID().replaceAll("-", "")}` });
  t.after(async () => { await mongoose.connection.dropDatabase(); await mongoose.disconnect(); });
  await Promise.all(Object.values(models).map((m) => m.init()));
  const { Admin, AdminAuthSession, CampusAmbassador, Task, PromoCode, Registration } = models;
  const password = "IntegrationAdmin2026!";
  const admin = await Admin.create({ adminId: "AD-TEST-ADMIN", name: "Test Admin", email: "admin@example.test", passwordHash: await hashPassword(password), mustChangePassword: false });
  const agent = request.agent(app);
  const api = (method, path) => agent[method](`/api/v1/admin${path}`).set("Origin", "http://localhost:5173");
  await t.test("anonymous and invalid credentials are rejected without leaking account existence", async () => {
    await api("get", "/dashboard").expect(401);
    const page = await agent.get("/renaissance/admin/campus-ambassadors").expect(302);
    assert.equal(page.headers.location, "/renaissance/admin/login");
    assert.match(page.headers["x-robots-tag"], /noindex/);
    const wrong = await api("post", "/auth/login").send({ email: admin.email, password: "Wrong123!" }).expect(401);
    const unknown = await api("post", "/auth/login").send({ email: "nobody@example.test", password }).expect(401);
    assert.equal(wrong.body.error.message, unknown.body.error.message);
  });
  const login = await api("post", "/auth/login").send({ email: admin.email, password }).expect(200);
  const cookies = login.headers["set-cookie"].map((cookie) => cookie.split(";")[0]);
  const originalAccess = cookies.find((cookie) => cookie.startsWith("rn_admin_access="));
  await t.test("admin cookie session opens dashboard and hides secrets", async () => {
    assert(login.headers["set-cookie"].every((cookie) => cookie.includes("HttpOnly")));
    assert(!JSON.stringify(login.body).includes("passwordHash"));
    await api("get", "/dashboard").expect(200);
  });
  let alice, bob, alicePassword;
  await t.test("create and edit ambassadors and reject duplicate promos atomically", async () => {
    const chosenPassword = "alicecampus2026";
    const created = await api("post", "/ambassadors").send({ name: "Alice Captain", email: "alice@example.test", college: "First College", promoCode: "ALICE26", password: chosenPassword }).expect(201);
    alice = created.body.data.ambassador; alicePassword = created.body.data.temporaryPassword;
    assert.equal(alicePassword, chosenPassword);
    assert.equal(Object.hasOwn(alice, "password"), false);
    const stored = await CampusAmbassador.findById(alice.id).select("+password +passwordHash");
    assert.equal(stored.password, alicePassword); assert.equal(stored.passwordHash, undefined);
    const roster = await api("get", "/ambassadors").expect(200);
    assert(!JSON.stringify(roster.body).includes(chosenPassword));
    const invalid = await api("post", "/ambassadors").send({ name: "Invalid Captain", email: "invalid-password@example.test", college: "Test College", password: "short" }).expect(400);
    assert.equal(invalid.body.error.code, "VALIDATION_ERROR");
    assert.equal(await CampusAmbassador.countDocuments({ email: "invalid-password@example.test" }), 0);
    const second = await api("post", "/ambassadors").send({ name: "Bob Captain", email: "bob@example.test", college: "Second College", promoCode: "BOB26" }).expect(201);
    bob = second.body.data.ambassador;
    await api("post", "/ambassadors").send({ name: "Duplicate Captain", email: "duplicate@example.test", college: "Third College", promoCode: "ALICE26" }).expect(409);
    assert.equal(await CampusAmbassador.countDocuments({ email: "duplicate@example.test" }), 0);
    await api("patch", `/ambassadors/${bob.id}`).send({ name: "Should roll back", promoCode: "ALICE26" }).expect(409);
    assert.equal((await CampusAmbassador.findById(bob.id)).name, "Bob Captain");
    await api("patch", `/ambassadors/${bob.id}`).send({ name: "Bob Updated", college: "Updated College" }).expect(200);
  });
  const ca = request.agent(app);
  const caApi = (method, path) => ca[method](`/api/v1/ambassador${path}`).set("Origin", "http://localhost:5173");
  const caLogin = await caApi("post", "/auth/login").send({ email: alice.email, password: alicePassword }).expect(200);
  const caAccess = caLogin.headers["set-cookie"].find((c) => c.startsWith("rn_access=")).split(";")[0];
  await t.test("CA sessions and spoofed admin roles cannot access admin endpoints", async () => {
    await ca.get("/api/v1/admin/dashboard").expect(401);
    await ca.get("/renaissance/admin/campus-ambassadors").expect(302);
    await request(app).get("/api/v1/admin/dashboard").set("Authorization", `Bearer ${caAccess.slice("rn_access=".length)}`).expect(401);
    await Admin.collection.updateOne({ _id: admin._id }, { $set: { role: "CAMPUS_AMBASSADOR" } });
    await api("get", "/dashboard").expect(403);
    await Admin.collection.updateOne({ _id: admin._id }, { $set: { role: "ADMIN" } });
  });
  let taskId;
  await t.test("bulk tasks appear for each active CA and submission reviews round trip", async () => {
    await api("post", "/tasks").send({ title: "Share launch post", description: "Share the official creative.", ambassadorId: "ALL", dueAt: "2026-10-03T12:00:00.000Z" }).expect(201);
    assert.equal(await Task.countDocuments(), 2);
    const own = await caApi("get", "/tasks").expect(200);
    assert.equal(own.body.data.tasks.length, 1); taskId = own.body.data.tasks[0].taskId;
    const other = await Task.findOne({ ambassadorId: bob.id });
    await caApi("get", `/tasks/${other.taskId}`).expect(404);
    await caApi("patch", `/tasks/${taskId}`).send({ status: "COMPLETED", remarks: "Shared with the club", completionDetails: "https://example.test/evidence" }).expect(200);
    const list = await api("get", "/tasks").expect(200);
    assert.equal(list.body.data.tasks.find((v) => v.taskId === taskId).reviewStatus, "PENDING");
    assert.equal((await api("get", "/dashboard").expect(200)).body.data.pendingReviews, 1);
    await api("post", `/tasks/${taskId}/review`).send({ decision: "CHANGES_REQUESTED", feedback: "" }).expect(400);
    await api("post", `/tasks/${taskId}/review`).send({ decision: "CHANGES_REQUESTED", feedback: "Please include the registration link." }).expect(200);
    const reopened = await caApi("get", `/tasks/${taskId}`).expect(200);
    assert.equal(reopened.body.data.task.status, "IN_PROGRESS");
    assert.equal(reopened.body.data.task.reviewFeedback, "Please include the registration link.");
    await caApi("patch", `/tasks/${taskId}`).send({ status: "COMPLETED", remarks: "Updated", completionDetails: "https://example.test/new-evidence" }).expect(200);
    await api("post", `/tasks/${taskId}/review`).send({ decision: "APPROVED", feedback: "Thank you" }).expect(200);
    assert.equal((await api("get", "/dashboard").expect(200)).body.data.pendingReviews, 0);
    await caApi("patch", `/tasks/${taskId}`).send({ status: "COMPLETED", remarks: "Tampered after approval", completionDetails: "Tampered" }).expect(409);
    await api("post", `/tasks/${taskId}/assign`).send({ ambassadorId: bob.id }).expect(409);
  });
  await t.test("reassignment clears previous owner's work and protects ownership", async () => {
    const response = await api("post", "/tasks").send({ title: "Reassignable mission", description: "Coordinate college outreach.", ambassadorId: alice.id }).expect(201);
    const id = response.body.data.task.taskId;
    await caApi("patch", `/tasks/${id}`).send({ status: "IN_PROGRESS", remarks: "Alice progress", completionDetails: "Alice proof" }).expect(200);
    await api("post", `/tasks/${id}/assign`).send({ ambassadorId: bob.id }).expect(200);
    await caApi("get", `/tasks/${id}`).expect(404);
    const saved = await Task.findOne({ taskId: id });
    assert.equal(saved.remarks, ""); assert.equal(saved.completionDetails, ""); assert.equal(saved.reviewFeedback, "");
    await api("delete", `/tasks/${id}`).expect(204);
  });
  await t.test("code edits preserve registration snapshots and stable attribution", async () => {
    const promo = await PromoCode.findOne({ ambassadorId: alice.id });
    await Registration.create({ registrationId: "RNX-TEST-REG", name: "Participant Example", email: "participant@example.test", phone: "+919999999999", college: "Test College", packageId: new mongoose.Types.ObjectId(), packageCode: "FEST", packageName: "Festival Pass", baseAmountPaise: 10000, finalAmountPaise: 10000, promoCodeId: promo._id, promoCode: promo.code, ambassadorId: alice.id });
    await api("patch", `/promo-codes/${promo.id}`).send({ code: "ALICENEW26" }).expect(200);
    const original = await Registration.findOne({ registrationId: "RNX-TEST-REG" });
    assert.equal(original.promoCode, "ALICE26"); assert.equal(String(original.ambassadorId), alice.id);
    assert.equal((await api("get", "/dashboard").expect(200)).body.data.referrals.total, 1);
    const roster = await api("get", "/ambassadors").expect(200);
    assert.equal(roster.body.data.ambassadors.find((a) => a.id === alice.id).registrationCount, 1);
  });
  await t.test("disabled accounts lose existing access and are excluded from bulk assignments", async () => {
    await api("patch", `/ambassadors/${alice.id}/status`).send({ status: "DISABLED" }).expect(200);
    await caApi("get", "/dashboard").expect(401);
    await caApi("post", "/auth/login").send({ email: alice.email, password: alicePassword }).expect(401);
    await api("post", "/tasks").send({ title: "Active crew only", description: "For currently active accounts.", ambassadorId: "ALL" }).expect(201);
    assert.equal(await Task.countDocuments({ title: "Active crew only", ambassadorId: alice.id }), 0);
    assert.equal(await Registration.countDocuments({ ambassadorId: alice.id }), 1);
    await api("patch", `/ambassadors/${alice.id}/status`).send({ status: "ACTIVE" }).expect(200);
  });
  await t.test("credential reset revokes CA sessions and stores the readable password", async () => {
    await caApi("post", "/auth/login").send({ email: alice.email, password: alicePassword }).expect(200);
    const reset = await api("post", `/ambassadors/${alice.id}/reset-credential`).send({}).expect(200);
    await caApi("get", "/dashboard").expect(401);
    await caApi("post", "/auth/login").send({ email: alice.email, password: alicePassword }).expect(401);
    await caApi("post", "/auth/login").send({ email: alice.email, password: reset.body.data.temporaryPassword }).expect(200);
    const stored = await CampusAmbassador.findById(alice.id).select("+password +passwordHash");
    assert.equal(stored.password, reset.body.data.temporaryPassword); assert.equal(stored.passwordHash, undefined);
  });
  await t.test("logout revokes captured admin access cookies, refresh and subsequent requests", async () => {
    await api("post", "/auth/logout").expect(200);
    await api("get", "/dashboard").expect(401);
    await request(app).get("/api/v1/admin/dashboard").set("Cookie", originalAccess).expect(401);
    await api("post", "/auth/refresh").expect(401);
    assert.equal(await AdminAuthSession.countDocuments({ adminId: admin._id, revokedAt: null }), 0);
  });
  await t.test("expired database sessions reject otherwise valid admin tokens", async () => {
    await api("post", "/auth/login").send({ email: admin.email, password }).expect(200);
    await AdminAuthSession.collection.updateMany({ adminId: admin._id, revokedAt: null }, { $set: { expiresAt: new Date(0) } });
    await api("get", "/dashboard").expect(401);
  });
  await t.test("new and legacy admins reach management directly while password changes remain optional", async () => {
    await Admin.create({ adminId: "AD-TEST-FIRST", name: "First Admin", email: "first-admin@example.test", passwordHash: await hashPassword(password) });
    assert.equal((await Admin.findOne({ email: "first-admin@example.test" })).mustChangePassword, false);
    // Accounts created before the policy change must also sign in directly.
    await Admin.updateOne({ email: "first-admin@example.test" }, { $set: { mustChangePassword: true } });
    const first = request.agent(app);
    const signedIn = await first.post("/api/v1/admin/auth/login").set("Origin", "http://localhost:5173")
      .send({ email: "first-admin@example.test", password }).expect(200);
    assert.equal(signedIn.body.data.admin.mustChangePassword, false);
    assert.equal((await Admin.findOne({ email: "first-admin@example.test" })).mustChangePassword, false);
    await first.get("/api/v1/admin/dashboard").expect(200);
    // Existing sessions ignore stale flags too, without requiring a new login.
    await Admin.updateOne({ email: "first-admin@example.test" }, { $set: { mustChangePassword: true } });
    const me = await first.get("/api/v1/admin/auth/me").expect(200);
    assert.equal(me.body.data.admin.mustChangePassword, false);
    await first.get("/api/v1/admin/ambassadors").expect(200);
    const page = await first.get("/renaissance/admin").expect(302);
    assert.equal(page.headers.location, "/renaissance/admin/campus-ambassadors");
    const refreshed = await first.post("/api/v1/admin/auth/refresh").set("Origin", "http://localhost:5173").expect(200);
    assert.equal(refreshed.body.data.admin.mustChangePassword, false);
    const changed = await first.post("/api/v1/admin/auth/change-password").set("Origin", "http://localhost:5173")
      .send({ currentPassword: password, newPassword: "PermanentAdmin2026!" }).expect(200);
    assert.equal(changed.body.data.admin.mustChangePassword, false);
    await first.get("/api/v1/admin/dashboard").expect(200);
    const oldAccess = signedIn.headers["set-cookie"].find((cookie) => cookie.startsWith("rn_admin_access=")).split(";")[0];
    await request(app).get("/api/v1/admin/dashboard").set("Cookie", oldAccess).expect(401);
  });
});
