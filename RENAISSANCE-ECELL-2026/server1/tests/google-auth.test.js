import assert from "node:assert/strict";
import test from "node:test";
import { Passport } from "passport";
import request from "supertest";
import configurePassport from "../src/config/passport.js";

process.env.NODE_ENV = "test";
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/renaissance_server1_test";
process.env.JWT_ACCESS_SECRET = "test-access-secret-that-is-at-least-32-characters-long";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-that-is-at-least-32-characters-long";
process.env.GOOGLE_CLIENT_ID = "";
process.env.GOOGLE_CLIENT_SECRET = "";

const { app } = await import("../src/app.js");

test("Google strategy is optional when credentials are absent or incomplete", () => {
  for (const config of [{}, { GOOGLE_CLIENT_ID: "test-client" }, { GOOGLE_CLIENT_ID: " ", GOOGLE_CLIENT_SECRET: "test-secret" }]) {
    assert.equal(configurePassport(new Passport(), config), false);
  }
});

test("Google strategy can still be configured with both credentials", () => {
  const passport = new Passport();
  assert.equal(configurePassport(passport, {
    GOOGLE_CLIENT_ID: "test-client",
    GOOGLE_CLIENT_SECRET: "test-secret",
  }), true);
});

test("server health and CA authentication remain reachable without Google credentials", async () => {
  await request(app).get("/api/v1/health").expect(200);
  const ca = await request(app).get("/api/v1/ambassador/auth/me").expect(401);
  assert.equal(ca.body.error.code, "AUTH_REQUIRED");
  for (const path of ["/auth/google", "/auth/google/callback"]) {
    const result = await request(app).get(path).expect(503);
    assert.equal(result.body.error.code, "GOOGLE_AUTH_NOT_CONFIGURED");
  }
});
