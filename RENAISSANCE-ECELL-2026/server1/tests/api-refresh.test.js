import assert from "node:assert/strict";
import test from "node:test";
import { adminApi } from "../../client/src/lib/server1-api.js";

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json" },
});

test("a mutation is retried exactly once after a successful session refresh", async (t) => {
  const paths = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    paths.push(new URL(url).pathname);
    if (paths.length === 1) return json(401, { success: false });
    if (paths.length === 2) return json(200, { success: true });
    return json(201, { success: true, data: { task: { taskId: "TASK-TEST-1" } } });
  });
  const result = await adminApi.createTask({ title: "Outreach", ambassadorId: "ALL" });
  assert.equal(result.task.taskId, "TASK-TEST-1");
  assert.deepEqual(paths, ["/api/v1/admin/tasks", "/api/v1/admin/auth/refresh", "/api/v1/admin/tasks"]);
});

test("an invalid refresh does not replay a mutation", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => json(401, {
    success: false, error: { code: "ADMIN_AUTH_REQUIRED", message: "Sign in required" },
  }));
  await assert.rejects(adminApi.createTask({ title: "Outreach" }), { status: 401 });
  assert.equal(fetch.mock.callCount(), 2);
});

test("refresh outages are reported without replaying a mutation", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls += 1;
    return calls === 1 ? json(401, { success: false }) : json(503, {
      success: false, error: { code: "DATABASE_UNAVAILABLE", message: "Database unavailable" },
    });
  });
  await assert.rejects(adminApi.createTask({ title: "Outreach" }), { status: 503, code: "DATABASE_UNAVAILABLE" });
  assert.equal(calls, 2);
});
