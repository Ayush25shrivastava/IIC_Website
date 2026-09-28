import { assertDatabaseReady } from "./database-ready.js";
import jwt from "jsonwebtoken";
import { ADMIN_ROLE, ADMIN_STATUS } from "../constants/domain.js";
import { Admin, AdminAuthSession } from "../models/index.js";
import { ADMIN_ACCESS_COOKIE_NAME } from "../utils/admin-auth-cookies.js";
import { verifyAdminAccessToken } from "../utils/admin-tokens.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "./async-handler.js";

function getToken(req) {
  const header = req.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7).trim();
  return req.cookies?.[ADMIN_ACCESS_COOKIE_NAME] || null;
}

export const requireAdminAuth = asyncHandler(async (req, _res, next) => {
  const token = getToken(req);
  if (!token) throw new ApiError(401, "Admin authentication is required", "ADMIN_AUTH_REQUIRED");

  let payload;
  try {
    payload = verifyAdminAccessToken(token);
  } catch (error) {
    const code = error instanceof jwt.TokenExpiredError
      ? "ADMIN_ACCESS_TOKEN_EXPIRED"
      : "INVALID_ADMIN_ACCESS_TOKEN";
    throw new ApiError(401, "Admin authentication token is invalid or expired", code);
  }

  assertDatabaseReady();
  if (!Object.values(ADMIN_ROLE).includes(payload.role) || !payload.sid || !await AdminAuthSession.exists({
    sessionId: payload.sid, adminId: payload.sub, revokedAt: null, expiresAt: { $gt: new Date() },
  })) throw new ApiError(401, "Admin session is no longer valid", "INVALID_ADMIN_SESSION");

  const admin = await Admin.findById(payload.sub).select("+authVersion");
  if (!admin) throw new ApiError(401, "Admin session is no longer valid", "ADMIN_NOT_FOUND");
  if (admin.status !== ADMIN_STATUS.ACTIVE || !Object.values(ADMIN_ROLE).includes(admin.role)) {
    throw new ApiError(403, "Admin account is disabled", "ADMIN_ACCOUNT_DISABLED");
  }
  if ((admin.authVersion ?? 0) !== payload.ver) {
    throw new ApiError(401, "Admin session is no longer valid", "ADMIN_AUTH_VERSION_MISMATCH");
  }

  req.admin = admin;
  req.adminAuth = payload;
  next();
});
