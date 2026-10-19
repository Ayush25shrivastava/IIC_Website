import assert from "node:assert/strict";
import test from "node:test";
import { legacyTeamPhotos, isLocalAdminLocation } from "../../client/src/lib/local-admin.js";

test("login-free admin is limited to local development", () => {
  assert.equal(isLocalAdminLocation(true, "localhost"), true);
  assert.equal(isLocalAdminLocation(true, "127.0.0.1"), true);
  assert.equal(isLocalAdminLocation(true, "[::1]"), true);
  assert.equal(isLocalAdminLocation(false, "localhost"), false);
  assert.equal(isLocalAdminLocation(true, "example.com"), false);
  assert.equal(isLocalAdminLocation(true, "localhost", "false"), false);
});

test("legacy photos remain available for migration without modifying browser storage", () => {
  const photos = [{ id: "old-member", name: "Student", image_url: "data:image/jpeg;base64,/9j/" }];
  const storage = { getItem: () => JSON.stringify(photos) };
  assert.deepEqual(legacyTeamPhotos(storage), photos);
  assert.deepEqual(legacyTeamPhotos({ getItem: () => "[]" }), []);
  assert.equal(legacyTeamPhotos({ getItem: () => null }).length, 2);
  assert.deepEqual(legacyTeamPhotos({ getItem: () => "invalid" }), []);
});
