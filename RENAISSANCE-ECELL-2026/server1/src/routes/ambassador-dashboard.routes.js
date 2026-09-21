import { Router } from "express";
import {
  getAmbassadorDashboard,
  getAmbassadorPromoCode,
  getAmbassadorReferrals,
  getAmbassadorTaskById,
  getAmbassadorTasks,
  patchAmbassadorTaskDetails,
  patchAmbassadorTaskStatus,
} from "../controllers/ambassador-dashboard.controller.js";
import {
  requireAmbassadorAuth,
  requirePasswordChanged,
} from "../middleware/ambassador-auth.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { requireTrustedOrigin } from "../middleware/trusted-origin.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validate.js";
import {
  ambassadorReferralListQuerySchema,
  ambassadorTaskDetailsSchema,
  ambassadorTaskListQuerySchema,
  ambassadorTaskStatusSchema,
  taskIdParamsSchema,
} from "../validators/ambassador-dashboard.schemas.js";

export const ambassadorDashboardRouter = Router();

ambassadorDashboardRouter.use(requireAmbassadorAuth, requirePasswordChanged);

ambassadorDashboardRouter.get("/dashboard", asyncHandler(getAmbassadorDashboard));
ambassadorDashboardRouter.get("/promo-code", asyncHandler(getAmbassadorPromoCode));
ambassadorDashboardRouter.get(
  "/tasks",
  validateQuery(ambassadorTaskListQuerySchema),
  asyncHandler(getAmbassadorTasks),
);
ambassadorDashboardRouter.get(
  "/tasks/:taskId",
  validateParams(taskIdParamsSchema),
  asyncHandler(getAmbassadorTaskById),
);
ambassadorDashboardRouter.patch(
  "/tasks/:taskId/status",
  requireTrustedOrigin,
  validateParams(taskIdParamsSchema),
  validateBody(ambassadorTaskStatusSchema),
  asyncHandler(patchAmbassadorTaskStatus),
);
ambassadorDashboardRouter.patch(
  "/tasks/:taskId/remarks",
  requireTrustedOrigin,
  validateParams(taskIdParamsSchema),
  validateBody(ambassadorTaskDetailsSchema),
  asyncHandler(patchAmbassadorTaskDetails),
);
ambassadorDashboardRouter.get(
  "/referrals",
  validateQuery(ambassadorReferralListQuerySchema),
  asyncHandler(getAmbassadorReferrals),
);
