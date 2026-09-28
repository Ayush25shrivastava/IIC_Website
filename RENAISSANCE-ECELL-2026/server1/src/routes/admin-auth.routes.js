import { requireDatabaseReady } from "../middleware/database-ready.js";
import { Router } from "express";
import {
  adminChangePassword,
  adminLogin,
  adminLoginLimiter,
  adminLogout,
  adminMe,
  adminRefresh,
  adminRefreshLimiter,
} from "../controllers/admin-auth.controller.js";
import { requireAdminAuth } from "../middleware/admin-auth.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { requireTrustedOrigin } from "../middleware/trusted-origin.js";
import { validateBody } from "../middleware/validate.js";
import { adminChangePasswordSchema, adminLoginSchema } from "../validators/admin-auth.schemas.js";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", requireTrustedOrigin, adminLoginLimiter, validateBody(adminLoginSchema), requireDatabaseReady, asyncHandler(adminLogin));
adminAuthRouter.post("/refresh", requireTrustedOrigin, adminRefreshLimiter, requireDatabaseReady, asyncHandler(adminRefresh));
adminAuthRouter.post("/logout", requireTrustedOrigin, requireDatabaseReady, asyncHandler(adminLogout));
adminAuthRouter.get("/me", requireAdminAuth, asyncHandler(adminMe));
adminAuthRouter.post(
  "/change-password",
  requireTrustedOrigin,
  requireAdminAuth,
  validateBody(adminChangePasswordSchema),
  asyncHandler(adminChangePassword),
);
