import { Router } from "express";
import { randomUUID } from "node:crypto";
import { TeamPhoto } from "../models/team-photo.model.js";
import { requireAdminAuth } from "../middleware/admin-auth.js";
import { requireTrustedOrigin } from "../middleware/trusted-origin.js";
import { requireDatabaseReady } from "../middleware/database-ready.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { teamPhotoSchema, teamPhotoIdSchema } from "../validators/team-photo.schemas.js";
import { getTeamPhoto, mergeTeamPhotos, serializeTeamPhoto } from "../services/team-photo.service.js";
import { ApiError } from "../utils/api-error.js";

const list = asyncHandler(async (_req, res) => {
  const members = mergeTeamPhotos(await TeamPhoto.find().sort({ createdAt: 1, _id: 1 }).lean());
  res.set("Cache-Control", "no-store").json({ success: true, data: { members: members.map(serializeTeamPhoto) } });
});
export const publicTeamPhotoRouter = Router();
publicTeamPhotoRouter.use(requireDatabaseReady);
publicTeamPhotoRouter.get("/", list);
publicTeamPhotoRouter.get("/:id/image", validateParams(teamPhotoIdSchema), asyncHandler(async (req, res) => {
  const member = await getTeamPhoto(req.validatedParams.id);
  const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(member.image_url);
  if (!match) throw new ApiError(404, "Uploaded photo not found", "PHOTO_NOT_FOUND");
  res.set({ "Content-Type": match[1], "Cache-Control": "no-cache", "Cross-Origin-Resource-Policy": "cross-origin" }).send(Buffer.from(match[2], "base64"));
}));

export const adminTeamPhotoRouter = Router();
adminTeamPhotoRouter.use(requireAdminAuth);
adminTeamPhotoRouter.get("/", list);
adminTeamPhotoRouter.post("/", requireTrustedOrigin, validateBody(teamPhotoSchema), asyncHandler(async (req, res) => {
  const member = await TeamPhoto.create({ _id: randomUUID(), ...req.validatedBody });
  res.status(201).json({ success: true, data: { member: serializeTeamPhoto(member) } });
}));
adminTeamPhotoRouter.put("/:id", requireTrustedOrigin, validateParams(teamPhotoIdSchema), validateBody(teamPhotoSchema.partial({ image_url: true })), asyncHandler(async (req, res) => {
  const previous = await getTeamPhoto(req.validatedParams.id);
  const member = await TeamPhoto.findByIdAndUpdate(req.validatedParams.id, { $set: { image_url: previous.image_url, ...req.validatedBody } }, { upsert: true, new: true, runValidators: true });
  res.json({ success: true, data: { member: serializeTeamPhoto(member) } });
}));
adminTeamPhotoRouter.delete("/:id", requireTrustedOrigin, validateParams(teamPhotoIdSchema), asyncHandler(async (req, res) => {
  const member = await getTeamPhoto(req.validatedParams.id);
  // Retain a tombstone so deleting a built-in faculty member does not restore it on reload.
  await TeamPhoto.findByIdAndUpdate(req.validatedParams.id, { $set: { name: member.name, category: member.category, image_url: "deleted", isDeleted: true } }, { upsert: true });
  res.status(204).end();
}));
