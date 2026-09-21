import { Router } from "express";
import {
  adminArchiveAmbassador, adminArchivePromo, adminAssignTask, adminCreateAmbassador, adminCreatePromo, adminCreateTask,
  adminDashboard, adminDeleteTask, adminGetAmbassador, adminGetTask, adminHardDeleteAmbassador,
  adminHardDeletePromo, adminListAmbassadors, adminListPromos, adminListReferrals, adminListTasks,
  adminSetAmbassadorStatus, adminSetPromoStatus, adminUpdateAmbassador, adminUpdatePromo, adminUpdateTask,
} from "../controllers/admin-management.controller.js";
import { requireAdminAuth, requireAdminPasswordChanged } from "../middleware/admin-auth.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { requireTrustedOrigin } from "../middleware/trusted-origin.js";
import { validateBody, validateParams, validateQuery } from "../middleware/validate.js";
import {
  adminIdParamsSchema, adminReferralListQuerySchema, ambassadorListQuerySchema, ambassadorStatusSchema,
  assignTaskSchema, createAmbassadorSchema, createPromoSchema, createTaskSchema, promoIdParamsSchema,
  promoListQuerySchema, promoStatusSchema, taskAdminParamsSchema, taskListAdminQuerySchema,
  updateAmbassadorSchema, updatePromoSchema, updateTaskAdminSchema,
} from "../validators/admin-management.schemas.js";

export const adminManagementRouter = Router();
adminManagementRouter.use(requireAdminAuth, requireAdminPasswordChanged);

adminManagementRouter.get("/dashboard", asyncHandler(adminDashboard));

adminManagementRouter.get("/ambassadors", validateQuery(ambassadorListQuerySchema), asyncHandler(adminListAmbassadors));
adminManagementRouter.post("/ambassadors", requireTrustedOrigin, validateBody(createAmbassadorSchema), asyncHandler(adminCreateAmbassador));
adminManagementRouter.get("/ambassadors/:id", validateParams(adminIdParamsSchema), asyncHandler(adminGetAmbassador));
adminManagementRouter.patch("/ambassadors/:id", requireTrustedOrigin, validateParams(adminIdParamsSchema), validateBody(updateAmbassadorSchema), asyncHandler(adminUpdateAmbassador));
adminManagementRouter.patch("/ambassadors/:id/status", requireTrustedOrigin, validateParams(adminIdParamsSchema), validateBody(ambassadorStatusSchema), asyncHandler(adminSetAmbassadorStatus));
adminManagementRouter.delete("/ambassadors/:id", requireTrustedOrigin, validateParams(adminIdParamsSchema), asyncHandler(adminArchiveAmbassador));
adminManagementRouter.delete("/ambassadors/:id/hard", requireTrustedOrigin, validateParams(adminIdParamsSchema), asyncHandler(adminHardDeleteAmbassador));

adminManagementRouter.get("/promo-codes", validateQuery(promoListQuerySchema), asyncHandler(adminListPromos));
adminManagementRouter.post("/promo-codes", requireTrustedOrigin, validateBody(createPromoSchema), asyncHandler(adminCreatePromo));
adminManagementRouter.patch("/promo-codes/:promoId", requireTrustedOrigin, validateParams(promoIdParamsSchema), validateBody(updatePromoSchema), asyncHandler(adminUpdatePromo));
adminManagementRouter.patch("/promo-codes/:promoId/status", requireTrustedOrigin, validateParams(promoIdParamsSchema), validateBody(promoStatusSchema), asyncHandler(adminSetPromoStatus));
adminManagementRouter.delete("/promo-codes/:promoId", requireTrustedOrigin, validateParams(promoIdParamsSchema), asyncHandler(adminArchivePromo));
adminManagementRouter.delete("/promo-codes/:promoId/hard", requireTrustedOrigin, validateParams(promoIdParamsSchema), asyncHandler(adminHardDeletePromo));

adminManagementRouter.get("/tasks", validateQuery(taskListAdminQuerySchema), asyncHandler(adminListTasks));
adminManagementRouter.post("/tasks", requireTrustedOrigin, validateBody(createTaskSchema), asyncHandler(adminCreateTask));
adminManagementRouter.get("/tasks/:taskId", validateParams(taskAdminParamsSchema), asyncHandler(adminGetTask));
adminManagementRouter.patch("/tasks/:taskId", requireTrustedOrigin, validateParams(taskAdminParamsSchema), validateBody(updateTaskAdminSchema), asyncHandler(adminUpdateTask));
adminManagementRouter.post("/tasks/:taskId/assign", requireTrustedOrigin, validateParams(taskAdminParamsSchema), validateBody(assignTaskSchema), asyncHandler(adminAssignTask));
adminManagementRouter.delete("/tasks/:taskId", requireTrustedOrigin, validateParams(taskAdminParamsSchema), asyncHandler(adminDeleteTask));

adminManagementRouter.get("/referrals", validateQuery(adminReferralListQuerySchema), asyncHandler(adminListReferrals));
