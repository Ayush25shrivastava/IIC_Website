import { Router } from "express";
import { requireAdminAuth } from "../middleware/admin-auth.js";
import { requireTrustedOrigin } from "../middleware/trusted-origin.js";
import { requireLocalTeamPhotoAdmin } from "../middleware/local-team-photo-admin.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { teamPhotoSchema, teamPhotoIdSchema } from "../validators/team-photo.schemas.js";
import { cloudinaryTeamPhotos } from "../services/cloudinary-team-photo.service.js";

const list = asyncHandler(async (_req, res) => {
  res.set("Cache-Control", "no-store").json({ success: true, data: { members: await cloudinaryTeamPhotos.list() } });
});
export const publicTeamPhotoRouter = Router();
publicTeamPhotoRouter.get("/", list);

function managementRouter(authorize) {
  const router = Router();
  router.use(authorize);
  router.use((_req, res, next) => { res.set("Cache-Control", "no-store"); next(); });
  router.get("/", list);
  router.post("/", requireTrustedOrigin, validateBody(teamPhotoSchema), asyncHandler(async (req, res) => {
    res.status(201).json({ success: true, data: { member: await cloudinaryTeamPhotos.create(req.validatedBody) } });
  }));
  router.post("/import/:id", requireTrustedOrigin, validateParams(teamPhotoIdSchema), validateBody(teamPhotoSchema), asyncHandler(async (req, res) => {
    res.json({ success: true, data: { member: await cloudinaryTeamPhotos.import(req.validatedParams.id, req.validatedBody) } });
  }));
  router.put("/:id", requireTrustedOrigin, validateParams(teamPhotoIdSchema), validateBody(teamPhotoSchema.partial({ image_url: true })), asyncHandler(async (req, res) => {
    res.json({ success: true, data: { member: await cloudinaryTeamPhotos.update(req.validatedParams.id, req.validatedBody) } });
  }));
  router.delete("/:id", requireTrustedOrigin, validateParams(teamPhotoIdSchema), asyncHandler(async (req, res) => {
    await cloudinaryTeamPhotos.remove(req.validatedParams.id);
    res.status(204).end();
  }));
  return router;
}
export const adminTeamPhotoRouter = managementRouter(requireAdminAuth);
export const localTeamPhotoRouter = managementRouter(requireLocalTeamPhotoAdmin);
