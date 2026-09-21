import jwt from "jsonwebtoken";
import { AMBASSADOR_STATUS } from "../constants/domain.js";
import { CampusAmbassador } from "../models/index.js";
import { ApiError } from "../utils/api-error.js";
import { ACCESS_COOKIE_NAME } from "../utils/auth-cookies.js";
import { verifyAccessToken } from "../utils/tokens.js";
import { asyncHandler } from "./async-handler.js";

function getAccessToken(req) {
  const header = req.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7).trim();
  return req.cookies?.[ACCESS_COOKIE_NAME] || null;
}

export const requireAmbassadorAuth = asyncHandler(async (req, _res, next) => {
  const token = getAccessToken(req);
  if (!token) {
    throw new ApiError(401, "Authentication is required", "AUTH_REQUIRED");
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    const code = error instanceof jwt.TokenExpiredError ? "ACCESS_TOKEN_EXPIRED" : "INVALID_ACCESS_TOKEN";
    throw new ApiError(401, "Authentication token is invalid or expired", code);
  }

  const ambassador = await CampusAmbassador.findById(payload.sub).select("+authVersion");
  if (!ambassador) {
    throw new ApiError(401, "Authentication session is no longer valid", "ACCOUNT_NOT_FOUND");
  }

  if (ambassador.status !== AMBASSADOR_STATUS.ACTIVE) {
    throw new ApiError(403, "Campus ambassador account is not active", "ACCOUNT_DISABLED");
  }

  if ((ambassador.authVersion ?? 0) !== payload.ver) {
    throw new ApiError(401, "Authentication session is no longer valid", "AUTH_VERSION_MISMATCH");
  }

  req.ambassador = ambassador;
  req.auth = payload;
  next();
});

export function requirePasswordChanged(req, _res, next) {
  if (req.ambassador?.mustChangePassword) {
    next(new ApiError(403, "Password change is required before continuing", "PASSWORD_CHANGE_REQUIRED"));
    return;
  }
  next();
}
