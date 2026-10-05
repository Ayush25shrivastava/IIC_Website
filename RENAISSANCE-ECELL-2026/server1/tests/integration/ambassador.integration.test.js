import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";

// Opt in with a disposable MongoDB server. Never connect to the application's configured database.
const mongoUri = process.env.MONGODB_TEST_URI;
test("database-backed ambassador session and ownership flow", { skip: !mongoUri }, async (t) => {
  process.env.NODE_ENV = "test";
  process.env.CLIENT_ORIGIN = "http://localhost:5173";
  process.env.MONGODB_URI = mongoUri;
  process.env.JWT_ACCESS_SECRET = "integration-access-secret-at-least-32-characters";
  process.env.JWT_REFRESH_SECRET = "integration-refresh-secret-at-least-32-characters";
  process.env.AUTH_COOKIE_SECURE = "false";
  const [{ default: mongoose }, { default: request }, { app }, models, passwords, tokens, { logger }] = await Promise.all([
    import("mongoose"), import("supertest"), import("../../src/app.js"), import("../../src/models/index.js"),
    import("../../src/utils/password.js"), import("../../src/utils/tokens.js"), import("../../src/utils/logger.js"),
  ]);
  logger.level = "silent";
  const { CampusAmbassador, AuthSession, Task, PromoCode, Registration } = models;
  await mongoose.connect(mongoUri, { dbName: `renaissance_ca_test_${randomUUID().replaceAll("-", "")}` });
  t.after(async () => { await mongoose.connection.dropDatabase(); await mongoose.disconnect(); });
  const passwordHash = await passwords.hashPassword("TestCaptain2026!");
  const alice = await CampusAmbassador.create({ ambassadorId: "CA-TEST-ALICE", name: "Alice Captain", email: "alice@example.test", college: "Test College", password: "TestCaptain2026!", mustChangePassword: false });
  const bob = await CampusAmbassador.create({ ambassadorId: "CA-TEST-BOB", name: "Bob Captain", email: "bob@example.test", college: "Other College", passwordHash, mustChangePassword: false });
  const aliceTask = await Task.create({ taskId: "TASK-TEST-ALICE", ambassadorId: alice._id, title: "Share the event", description: "Share the official event creatives with your college.", dueAt: "2026-10-01T12:00:00Z" });
  const bobTask = await Task.create({ taskId: "TASK-TEST-BOB", ambassadorId: bob._id, title: "Bob private task", description: "A separate ambassador mission." });
  const promo = await PromoCode.create({ code: "ALICE26", ambassadorId: alice._id });
  await Registration.create({ registrationId: "RNX-TEST-ALICE", name: "Participant Example", email: "participant@example.test", phone: "+919999999999", college: "Test College", packageId: new mongoose.Types.ObjectId(), packageCode: "FEST", packageName: "Festival pass", baseAmountPaise: 10000, finalAmountPaise: 10000, promoCodeId: promo._id, promoCode: promo.code, ambassadorId: alice._id });
  const agent = request.agent(app);
  const login = (email, password = "TestCaptain2026!") => agent.post("/api/v1/ambassador/auth/login").set("Origin", "http://localhost:5173").send({ email, password });
  await t.test("wrong credentials and disabled/wrong-role accounts return generic errors", async () => {
    const wrong = await login(alice.email, "IncorrectPassword123!").expect(401);
    const unknown = await login("unknown@example.test").expect(401);
    assert.equal(wrong.body.error.message, unknown.body.error.message);
    await CampusAmbassador.updateOne({ _id: bob._id }, { status: "DISABLED" });
    const disabled = await login(bob.email).expect(401);
    assert.equal(disabled.body.error.message, wrong.body.error.message);
    await CampusAmbassador.collection.updateOne({ _id: bob._id }, { $set: { status: "ACTIVE", role: "ADMIN" } });
    await login(bob.email).expect(401);
    await CampusAmbassador.collection.updateOne({ _id: bob._id }, { $set: { role: "CAMPUS_AMBASSADOR" } });
  });
  const response = await login(alice.email).expect(200);
  const originalCookies = response.headers["set-cookie"].map((c) => c.split(";")[0]);
  const originalAccess = originalCookies.find((c) => c.startsWith("rn_access="));
  const originalRefresh = originalCookies.find((c) => c.startsWith("rn_refresh="));
  await t.test("login uses HttpOnly cookies and never exposes secrets", async () => {
    assert(response.headers["set-cookie"].every((c) => c.includes("HttpOnly")));
    assert(!JSON.stringify(response.body).includes("passwordHash"));
    assert(!JSON.stringify(response.body).includes("authVersion"));
    assert(!JSON.stringify(response.body).includes(passwordHash));
    assert(!JSON.stringify(response.body).includes("TestCaptain2026!"));
    assert.equal(Object.hasOwn(response.body.data.ambassador, "password"), false);
    const stored = await CampusAmbassador.collection.findOne({ _id: alice._id });
    assert.equal(stored.password, "TestCaptain2026!");
    assert.equal(Object.hasOwn(stored, "passwordHash"), false);
    const me = await agent.get("/api/v1/ambassador/auth/me").expect(200);
    assert.equal(me.body.data.ambassador.name, alice.name);
    assert.equal(me.headers["cache-control"], "no-store");
  });
  await t.test("new admin-created ambassadors store readable passwords and can sign in", async () => {
    const { createAmbassadorByAdmin, setAmbassadorStatusByAdmin } = await import("../../src/services/admin-management.service.js");
    const result = await createAmbassadorByAdmin({
      name: "New Captain", email: "new-captain@example.test", college: "Test College",
    });
    const stored = await CampusAmbassador.collection.findOne({ email: result.ambassador.email });
    assert.equal(stored.password, result.temporaryPassword);
    assert.equal(Object.hasOwn(stored, "passwordHash"), false);
    assert.equal(Object.hasOwn(result.ambassador, "password"), false);
    // Profile changes must still work when credential fields are excluded from the query.
    await setAmbassadorStatusByAdmin(result.ambassador.ambassadorId, "DISABLED");
    await setAmbassadorStatusByAdmin(result.ambassador.ambassadorId, "ACTIVE");
    const createdAgent = request.agent(app);
    await createdAgent.post("/api/v1/ambassador/auth/login").set("Origin", "http://localhost:5173")
      .send({ email: result.ambassador.email, password: result.temporaryPassword }).expect(200);
    await createdAgent.get("/api/v1/ambassador/dashboard").expect(200);
    await createdAgent.post("/api/v1/ambassador/auth/logout").set("Origin", "http://localhost:5173").expect(200);
  });
  await t.test("dashboard uses database registrations and owner tasks with due dates", async () => {
    const dashboard = await agent.get("/api/v1/ambassador/dashboard").expect(200);
    assert.equal(dashboard.body.data.referralStats.total, 1);
    assert.equal(dashboard.body.data.promoCode.registrationCount, 1);
    assert.equal(dashboard.body.data.promoCode.code, "ALICE26");
    const tasks = await agent.get("/api/v1/ambassador/tasks").expect(200);
    assert.equal(tasks.body.data.tasks.length, 1);
    assert.equal(tasks.body.data.tasks[0].dueAt, "2026-10-01T12:00:00.000Z");
    const referrals = await agent.get("/api/v1/ambassador/referrals").expect(200);
    assert.equal(referrals.body.data.referrals.length, 1);
    assert(!JSON.stringify(referrals.body).includes("participant@example.test"));
  });
  const update = { status: "IN_PROGRESS", remarks: "Shared with the college club.", completionDetails: "Announcement posted." };
  await t.test("task status and details persist together and reject ownership spoofing", async () => {
    await agent.patch(`/api/v1/ambassador/tasks/${aliceTask.taskId}`).set("Origin", "http://localhost:5173").send(update).expect(200);
    const saved = await Task.findById(aliceTask._id);
    assert.equal(saved.status, update.status); assert.equal(saved.remarks, update.remarks);
    const reloaded = await agent.get(`/api/v1/ambassador/tasks/${aliceTask.taskId}`).expect(200);
    assert.equal(reloaded.body.data.task.completionDetails, update.completionDetails);
    await agent.get(`/api/v1/ambassador/tasks/${bobTask.taskId}`).expect(404);
    for (const [suffix, body] of [["", update], ["/status", { status: "COMPLETED" }], ["/remarks", { remarks: "tampered" }]]) {
      await agent.patch(`/api/v1/ambassador/tasks/${bobTask.taskId}${suffix}`).set("Origin", "http://localhost:5173").send(body).expect(404);
    }
    await agent.patch(`/api/v1/ambassador/tasks/${aliceTask.taskId}`).set("Origin", "http://localhost:5173").send({ ...update, ambassadorId: bob._id.toString() }).expect(400);
    assert.equal((await Task.findById(bobTask._id)).remarks, "");
    await agent.patch(`/api/v1/ambassador/tasks/${aliceTask.taskId}`).set("Origin", "https://untrusted.invalid").send(update).expect(403);
  });
  await t.test("ambassador credentials cannot access admin APIs", async () => {
    await agent.get("/api/v1/admin/dashboard").expect(401);
    await request(app).get("/api/v1/admin/dashboard").set("Authorization", `Bearer ${originalAccess.slice("rn_access=".length)}`).expect(401);
  });
  await t.test("admin task lifecycle preserves progress dates and isolates reassigned work", async () => {
    const { signAdminAccessToken } = await import("../../src/utils/admin-tokens.js");
    const admin = await models.Admin.create({
      adminId: "AD-TEST-CAPTAIN", name: "Test Admin", email: "admin@example.test",
      passwordHash, mustChangePassword: false,
    });
    const sessionId = randomUUID();
    await models.AdminAuthSession.create({ sessionId, adminId: admin._id, tokenHash: "test-token-hash", expiresAt: new Date(Date.now() + 60000) });
    const adminToken = signAdminAccessToken(admin, sessionId);
    const adminRequest = (method, path) => request(app)[method](`/api/v1/admin/tasks${path}`)
      .set("Authorization", `Bearer ${adminToken}`).set("Origin", "http://localhost:5173");
    const created = await adminRequest("post", "").send({
      title: "Admin assigned mission", description: "Share the official college announcement.",
      ambassadorId: alice._id.toString(), dueAt: "2026-10-02T12:00:00.000Z",
    }).expect(201);
    const taskId = created.body.data.task.taskId;
    const path = `/${taskId}`;
    const ownerPath = `/api/v1/ambassador/tasks/${taskId}`;
    const owned = await agent.get(ownerPath).expect(200);
    assert.equal(owned.body.data.task.dueAt, "2026-10-02T12:00:00.000Z");
    await agent.patch(ownerPath).set("Origin", "http://localhost:5173").send(update).expect(200);
    // Use a fixed historical start time so an accidental timestamp overwrite is observable.
    const startedAt = new Date("2026-09-01T10:00:00Z");
    await Task.updateOne({ taskId }, { $set: { startedAt } });
    await adminRequest("delete", path).expect(409);
    const sameOwner = await adminRequest("post", `${path}/assign`).send({ ambassadorId: alice._id.toString() }).expect(200);
    assert.equal(sameOwner.body.data.task.status, "IN_PROGRESS");
    assert.equal(sameOwner.body.data.task.remarks, update.remarks);
    const completed = await adminRequest("patch", path).send({ status: "COMPLETED" }).expect(200);
    assert.equal(completed.body.data.task.startedAt, startedAt.toISOString());
    const repeated = await adminRequest("patch", path).send({ status: "COMPLETED" }).expect(200);
    assert.equal(repeated.body.data.task.completedAt, completed.body.data.task.completedAt);
    await agent.patch(ownerPath).set("Origin", "http://localhost:5173").send(update).expect(409);
    await adminRequest("post", `${path}/assign`).send({ ambassadorId: bob._id.toString() }).expect(409);
    const reopened = await adminRequest("patch", path).send({ status: "IN_PROGRESS", dueAt: null }).expect(200);
    assert.equal(reopened.body.data.task.completedAt, null);
    assert.equal(reopened.body.data.task.startedAt, startedAt.toISOString());
    assert.equal(reopened.body.data.task.dueAt, null);
    const reassigned = await adminRequest("post", `${path}/assign`).send({ ambassadorId: bob._id.toString() }).expect(200);
    assert.equal(reassigned.body.data.task.status, "ASSIGNED");
    assert.equal(reassigned.body.data.task.remarks, "");
    assert.equal(reassigned.body.data.task.completionDetails, "");
    assert.equal(reassigned.body.data.task.startedAt, null);
    assert.equal(reassigned.body.data.task.completedAt, null);
    await agent.get(ownerPath).expect(404);
    await agent.patch(ownerPath).set("Origin", "http://localhost:5173").send(update).expect(404);
    await adminRequest("delete", path).expect(204);
    assert.equal(await Task.exists({ taskId }), null);
  });
  await t.test("admin mutations cannot overwrite or delete progress saved during a concurrent request", async (raceTest) => {
    const { updateTaskByAdmin, assignTaskByAdmin, deleteTaskByAdmin } = await import("../../src/services/admin-management.service.js");
    const scenarios = [
      ["UPDATE", "findOneAndUpdate", (id) => updateTaskByAdmin(id, { status: "ASSIGNED" })],
      ["ASSIGN", "findOneAndUpdate", (id) => assignTaskByAdmin(id, bob._id)],
      ["DELETE", "deleteOne", (id) => deleteTaskByAdmin(id)],
    ];
    for (const [label, method, mutate] of scenarios) {
      const task = await Task.create({
        taskId: `TASK-RACE-${label}`, ambassadorId: alice._id,
        title: "Concurrent mission", description: "Protect recently saved ambassador progress.",
      });
      const original = Task[method];
      const mocked = raceTest.mock.method(Task, method, async function (...args) {
        // Save progress between the admin's read and its write to reproduce the race deterministically.
        await Task.collection.updateOne({ _id: task._id }, { $set: {
          remarks: "Just saved by the ambassador",
          updatedAt: new Date(task.updatedAt.getTime() + 1000),
        } });
        return original.apply(this, args);
      });
      try {
        await assert.rejects(mutate(task.taskId), (error) => error.code === "TASK_CHANGED" && error.statusCode === 409);
      } finally {
        mocked.mock.restore();
      }
      const saved = await Task.findById(task._id);
      assert(saved);
      assert.equal(saved.remarks, "Just saved by the ambassador");
      assert.equal(saved.ambassadorId.toString(), alice._id.toString());
    }
  });
  await t.test("refresh restores access and rotates the refresh token", async () => {
    const refreshed = await agent.post("/api/v1/ambassador/auth/refresh").set("Origin", "http://localhost:5173").expect(200);
    assert.notEqual(refreshed.headers["set-cookie"].find((c) => c.startsWith("rn_refresh=")).split(";")[0], originalRefresh);
    await agent.get("/api/v1/ambassador/dashboard").expect(200);
  });
  await t.test("logout revokes stored session and previously captured access tokens", async () => {
    await agent.post("/api/v1/ambassador/auth/logout").set("Origin", "http://localhost:5173").expect(200);
    await agent.get("/api/v1/ambassador/dashboard").expect(401);
    await request(app).get("/api/v1/ambassador/dashboard").set("Cookie", originalAccess).expect(401);
    await request(app).post("/api/v1/ambassador/auth/refresh").set("Origin", "http://localhost:5173").set("Cookie", originalRefresh).expect(401);
    assert.equal(await AuthSession.countDocuments({ ambassadorId: alice._id, revokedAt: null }), 0);
  });
  await t.test("first login and existing sessions reach dashboard without a password change", async () => {
    await CampusAmbassador.updateOne({ _id: bob._id }, { mustChangePassword: true });
    const signedIn = await login(bob.email).expect(200);
    assert.equal(signedIn.body.data.mustChangePassword, false);
    const converted = await CampusAmbassador.collection.findOne({ _id: bob._id });
    assert.equal(converted.password, "TestCaptain2026!");
    assert.equal(Object.hasOwn(converted, "passwordHash"), false);
    assert.equal((await CampusAmbassador.findById(bob._id)).mustChangePassword, false);
    // A session created before this change must also keep working with a legacy flag.
    await CampusAmbassador.updateOne({ _id: bob._id }, { mustChangePassword: true });
    for (const endpoint of ["dashboard", "tasks", "promo-code", "referrals"]) {
      await agent.get(`/api/v1/ambassador/${endpoint}`).expect(200);
    }
    const me = await agent.get("/api/v1/ambassador/auth/me").expect(200);
    assert.equal(me.body.data.ambassador.mustChangePassword, false);
    // Voluntary password changes remain authenticated and revoke old sessions.
    await agent.post("/api/v1/ambassador/auth/change-password").set("Origin", "http://localhost:5173").send({ currentPassword: "WrongCaptain2026!", newPassword: "NewCaptainPassword2026!" }).expect(400);
    const changed = await agent.post("/api/v1/ambassador/auth/change-password").set("Origin", "http://localhost:5173").send({ currentPassword: "TestCaptain2026!", newPassword: "NewCaptainPassword2026!" }).expect(200);
    assert(!JSON.stringify(changed.body).includes("NewCaptainPassword2026!"));
    const stored = await CampusAmbassador.collection.findOne({ _id: bob._id });
    assert.equal(stored.password, "NewCaptainPassword2026!");
    assert.equal(Object.hasOwn(stored, "passwordHash"), false);
    await agent.get("/api/v1/ambassador/dashboard").expect(200);
  });
  await t.test("expired and revoked sessions are rejected even with valid access signatures", async () => {
    const session = await AuthSession.findOne({ ambassadorId: bob._id, revokedAt: null });
    const currentBob = await CampusAmbassador.findById(bob._id).select("+authVersion");
    const access = tokens.signAccessToken(currentBob, session.sessionId);
    await AuthSession.collection.updateOne({ _id: session._id }, { $set: { expiresAt: new Date(0) } });
    await request(app).get("/api/v1/ambassador/dashboard").set("Cookie", `rn_access=${access}`).expect(401);
  });
});
