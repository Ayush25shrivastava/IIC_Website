import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  changeAmbassadorPassword,
  getCurrentAmbassador,
  loginAmbassador,
  logoutAmbassador,
  refreshAmbassadorSession,
} from "../controllers/ambassador-auth.controller.js";
import { requireAmbassadorAuth } from "../middleware/ambassador-auth.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { requireTrustedOrigin } from "../middleware/trusted-origin.js";
import { validateBody } from "../middleware/validate.js";
import { ApiError } from "../utils/api-error.js";
import {
  ambassadorChangePasswordSchema,
  ambassadorLoginSchema,
} from "../validators/ambassador-auth.schemas.js";

function authRateLimiter({ limit, code, message }) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler(_req, _res, next) {
      next(new ApiError(429, message, code));
    },
  });
}

const loginLimiter = authRateLimiter({
  limit: 8,
  code: "LOGIN_RATE_LIMITED",
  message: "Too many login attempts. Try again later.",
});

const refreshLimiter = authRateLimiter({
  limit: 120,
  code: "REFRESH_RATE_LIMITED",
  message: "Too many refresh attempts. Try again later.",
});

export const ambassadorAuthRouter = Router();

ambassadorAuthRouter.post(
  "/login",
  requireTrustedOrigin,
  loginLimiter,
  validateBody(ambassadorLoginSchema),
  asyncHandler(loginAmbassador),
);
ambassadorAuthRouter.post(
  "/refresh",
  requireTrustedOrigin,
  refreshLimiter,
  asyncHandler(refreshAmbassadorSession),
);
ambassadorAuthRouter.post(
  "/logout",
  requireTrustedOrigin,
  asyncHandler(logoutAmbassador),
);
ambassadorAuthRouter.get("/me", requireAmbassadorAuth, asyncHandler(getCurrentAmbassador));
ambassadorAuthRouter.post(
  "/change-password",
  requireTrustedOrigin,
  requireAmbassadorAuth,
  validateBody(ambassadorChangePasswordSchema),
  asyncHandler(changeAmbassadorPassword),
);
