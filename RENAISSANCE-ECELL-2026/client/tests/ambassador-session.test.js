import assert from "node:assert/strict";
import { test } from "node:test";
import { setImmediate } from "node:timers/promises";

const response = () => new Response(JSON.stringify({ success: true, data: {} }), {
  headers: { "Content-Type": "application/json" },
});

async function apiForTest(t, fetch) {
  t.mock.method(globalThis, "fetch", fetch);
  return import(`../src/lib/server1-api.js?test=${encodeURIComponent(t.name)}`);
}

test("exit logout starts immediately and survives page navigation", async (t) => {
  const calls = [];
  const { ambassadorApi } = await apiForTest(t, async (url, options) => {
    calls.push({ url, options });
    return response();
  });
  const logout = ambassadorApi.logout({ keepalive: true });
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/ambassador\/auth\/logout$/);
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.keepalive, true);
  assert.equal(calls[0].options.credentials, "include");
  await logout;
});

test("returning login waits until the old session has been revoked", async (t) => {
  const calls = [];
  let finishLogout;
  const { ambassadorApi } = await apiForTest(t, (url) => {
    calls.push(url);
    return url.endsWith("/logout")
      ? new Promise((resolve) => { finishLogout = resolve; })
      : Promise.resolve(response());
  });
  const logout = ambassadorApi.logout({ keepalive: true });
  const login = ambassadorApi.login({ email: "test@example.com", password: "test-only" });
  assert.equal(calls.length, 1);
  finishLogout(response());
  await Promise.all([logout, login]);
  assert.deepEqual(calls.map((url) => url.split("/").at(-1)), ["logout", "login"]);
});

test("leaving during login revokes the session after login finishes", async (t) => {
  const calls = [];
  let finishLogin;
  const { ambassadorApi } = await apiForTest(t, (url) => {
    calls.push(url);
    return url.endsWith("/login")
      ? new Promise((resolve) => { finishLogin = resolve; })
      : Promise.resolve(response());
  });
  const login = ambassadorApi.login({ email: "test@example.com", password: "test-only" });
  const logout = ambassadorApi.logout({ keepalive: true });
  assert.equal(calls.length, 1);
  finishLogin(response());
  await Promise.all([login, logout]);
  assert.deepEqual(calls.map((url) => url.split("/").at(-1)), ["login", "logout"]);
});

test("failed logout can be retried without blocking future sign-in", async (t) => {
  let calls = 0;
  const { ambassadorApi } = await apiForTest(t, async () => {
    if (++calls === 1) throw new TypeError("Network unavailable");
    return response();
  });
  await assert.rejects(ambassadorApi.logout({ keepalive: true }), /Network unavailable/);
  await ambassadorApi.logout();
  await ambassadorApi.login({ email: "test@example.com", password: "test-only" });
  assert.equal(calls, 3);
});

test("a refresh already in flight completes before session revocation", async (t) => {
  const calls = [];
  let finishRefresh;
  const { ambassadorApi } = await apiForTest(t, async (url) => {
    calls.push(url);
    if (url.endsWith("/me")) return new Response("Unauthorized", { status: 401 });
    if (url.endsWith("/refresh")) return new Promise((resolve) => { finishRefresh = resolve; });
    return response();
  });
  const me = ambassadorApi.me().catch(() => {});
  await setImmediate();
  const logout = ambassadorApi.logout({ keepalive: true });
  assert.equal(calls.some((url) => url.endsWith("/logout")), false);
  finishRefresh(response());
  await Promise.all([me, logout]);
  assert.ok(calls.findIndex((url) => url.endsWith("/refresh")) < calls.findIndex((url) => url.endsWith("/logout")));
});
