import { Router } from "express";
import {
  getTeamMembers,
  adminListTeamMembers,
  adminCreateTeamMember,
  adminUpdateTeamMember,
  adminDeleteTeamMember,
  adminAdjustSlots,
} from "../controllers/team-member.controller.js";
import { requireAdminAuth } from "../middleware/admin-auth.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { requireTrustedOrigin } from "../middleware/trusted-origin.js";

// Public Router
export const teamMemberPublicRouter = Router();
teamMemberPublicRouter.get("/", asyncHandler(getTeamMembers));

// Admin Router (requires admin authentication)
export const teamMemberAdminRouter = Router();
teamMemberAdminRouter.use(requireAdminAuth);

teamMemberAdminRouter.get("/", asyncHandler(adminListTeamMembers));
teamMemberAdminRouter.post("/", requireTrustedOrigin, asyncHandler(adminCreateTeamMember));
teamMemberAdminRouter.post("/adjust-slots", requireTrustedOrigin, asyncHandler(adminAdjustSlots));
teamMemberAdminRouter.put("/:id", requireTrustedOrigin, asyncHandler(adminUpdateTeamMember));
teamMemberAdminRouter.delete("/:id", requireTrustedOrigin, asyncHandler(adminDeleteTeamMember));
