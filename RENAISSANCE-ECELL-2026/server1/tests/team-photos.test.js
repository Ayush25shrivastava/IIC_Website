import assert from "node:assert/strict";
import test from "node:test";
import { teamPhotoSchema, validPhotoSource } from "../src/validators/team-photo.schemas.js";
import { mergeTeamPhotos, serializeTeamPhoto } from "../src/services/team-photo.service.js";

test("team photo validation allows supported categories and rejects unsafe image sources", () => {
  const member = { name: "Team Member", category: "fourth", image_url: "https://example.com/photo.jpg" };
  assert.equal(teamPhotoSchema.parse(member).category, "fourth");
  for (const category of ["faculty", "third", "second", "first", "other"]) assert(teamPhotoSchema.safeParse({ ...member, category }).success);
  assert(!teamPhotoSchema.safeParse({ ...member, category: "gallery" }).success);
  for (const source of ["javascript:alert(1)", "data:image/svg+xml;base64,PHN2Zz4=", "data:image/png;base64,YWJjZA==", "http://example.com/image.jpg"]) assert.equal(validPhotoSource(source), false);
  assert(!teamPhotoSchema.safeParse({ ...member, linkedin: "javascript:alert(1)" }).success);
  assert(!validPhotoSource(`data:image/jpeg;base64,${Buffer.alloc(350001, 255).toString("base64")}`));
});

test("faculty overrides replace defaults and deleted defaults stay removed", () => {
  const members = mergeTeamPhotos([
    { _id: "faculty-mukul-shukla", name: "Updated Professor", category: "faculty", image_url: "https://example.com/new.jpg" },
    { _id: "faculty-mayank-pandey", isDeleted: true },
    { _id: "new-member", name: "Student", category: "third", image_url: "https://example.com/student.jpg" },
  ]);
  assert.deepEqual(members.map((member) => member.name), ["Updated Professor", "Student"]);
  assert.equal(mergeTeamPhotos([{ _id: "faculty-mukul-shukla", isDeleted: true }, { _id: "faculty-mayank-pandey", isDeleted: true }]).length, 0);
});

test("uploaded image bytes are not embedded in the team list response", () => {
  const member = serializeTeamPhoto({ _id: "photo", name: "Student", category: "fourth", image_url: "data:image/jpeg;base64,/9j/" });
  assert.equal(member.uploaded, true);
  assert.equal(member.image_url, "");
  assert.equal(member.id, "photo");
});
