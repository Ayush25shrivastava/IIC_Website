import { requireDatabaseReady } from "../middleware/database-ready.js";
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

export function authRateLimiter({ limit, code, message, countOnlyFailures = false }) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    // A database outage or a successful login must not use up failed-login
    // attempts. Keep counting 4xx responses (bad credentials/invalid input).
    skipSuccessfulRequests: countOnlyFailures,
    requestWasSuccessful: (_req, res) => res.statusCode < 400 || res.statusCode >= 500,
    handler(_req, res, next) {
      const retryAfterSeconds = Number(res.getHeader("Retry-After")) || 15 * 60;
      const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
      const detail = countOnlyFailures
        ? `${message} Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`
        : message;
      next(new ApiError(429, detail, code, { retryAfterSeconds }));
    },
  });
}

const loginLimiter = authRateLimiter({
  limit: 8,
  code: "LOGIN_RATE_LIMITED",
  message: "Too many unsuccessful login attempts.",
  countOnlyFailures: true,
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
  requireDatabaseReady, asyncHandler(loginAmbassador),
);
ambassadorAuthRouter.post(
  "/refresh",
  requireTrustedOrigin,
  refreshLimiter,
  requireDatabaseReady, asyncHandler(refreshAmbassadorSession),
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
