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

for (const scope of ["ambassador", "admin"]) {
  test(`${scope}: exit logout starts immediately and survives page navigation`, async (t) => {
    const calls = [];
    const apiModule = await apiForTest(t, async (url, options) => {
      calls.push({ url, options });
      return response();
    });
    const api = apiModule[`${scope}Api`];
    const logout = api.logout({ keepalive: true });
    assert.equal(calls.length, 1);
    assert.ok(calls[0].url.endsWith(`/${scope}/auth/logout`));
    assert.equal(calls[0].options.method, "POST");
    assert.equal(calls[0].options.keepalive, true);
    assert.equal(calls[0].options.credentials, "include");
    await logout;
  });

  test(`${scope}: returning login waits until the old session has been revoked`, async (t) => {
    const calls = [];
    let finishLogout;
    const apiModule = await apiForTest(t, (url) => {
      calls.push(url);
      return url.endsWith("/logout")
        ? new Promise((resolve) => { finishLogout = resolve; })
        : Promise.resolve(response());
    });
    const api = apiModule[`${scope}Api`];
    const logout = api.logout({ keepalive: true });
    const login = api.login({ email: "test@example.com", password: "test-only" });
    assert.equal(calls.length, 1);
    finishLogout(response());
    await Promise.all([logout, login]);
    assert.deepEqual(calls.map((url) => url.split("/").at(-1)), ["logout", "login"]);
  });

  test(`${scope}: leaving during login revokes the session after login finishes`, async (t) => {
    const calls = [];
    let finishLogin;
    const apiModule = await apiForTest(t, (url) => {
      calls.push(url);
      return url.endsWith("/login")
        ? new Promise((resolve) => { finishLogin = resolve; })
        : Promise.resolve(response());
    });
    const api = apiModule[`${scope}Api`];
    const login = api.login({ email: "test@example.com", password: "test-only" });
    const logout = api.logout({ keepalive: true });
    assert.equal(calls.length, 1);
    finishLogin(response());
    await Promise.all([login, logout]);
    assert.deepEqual(calls.map((url) => url.split("/").at(-1)), ["login", "logout"]);
  });

  test(`${scope}: failed logout can be retried without blocking future sign-in`, async (t) => {
    let calls = 0;
    const apiModule = await apiForTest(t, async () => {
      if (++calls === 1) throw new TypeError("Network unavailable");
      return response();
    });
    const api = apiModule[`${scope}Api`];
    await assert.rejects(api.logout({ keepalive: true }), /Network unavailable/);
    await api.logout();
    await api.login({ email: "test@example.com", password: "test-only" });
    assert.equal(calls, 3);
  });

  test(`${scope}: a refresh already in flight completes before session revocation`, async (t) => {
    const calls = [];
    let finishRefresh;
    const apiModule = await apiForTest(t, async (url) => {
      calls.push(url);
      if (url.endsWith("/me")) return new Response("Unauthorized", { status: 401 });
      if (url.endsWith("/refresh")) return new Promise((resolve) => { finishRefresh = resolve; });
      return response();
    });
    const api = apiModule[`${scope}Api`];
    const me = api.me().catch(() => {});
    await setImmediate();
    const logout = api.logout({ keepalive: true });
    assert.equal(calls.some((url) => url.endsWith("/logout")), false);
    finishRefresh(response());
    await Promise.all([me, logout]);
    assert.ok(calls.findIndex((url) => url.endsWith("/refresh")) < calls.findIndex((url) => url.endsWith("/logout")));
  });
}
