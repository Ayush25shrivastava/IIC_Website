import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { ADMIN_STATUS } from "../constants/domain.js";
import { Admin, AdminAuthSession } from "../models/index.js";
import {
  createAdminAuthSession,
  publicAdmin,
  revokeAdminSessions,
  rotateAdminAuthSession,
} from "../services/admin-auth.service.js";
import { clearAdminAuthCookies, ADMIN_REFRESH_COOKIE_NAME } from "../utils/admin-auth-cookies.js";
import { verifyAdminRefreshToken } from "../utils/admin-tokens.js";
import { ApiError } from "../utils/api-error.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, error: { code: "ADMIN_LOGIN_RATE_LIMITED", message: "Too many admin login attempts" } },
});

export const adminRefreshLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export async function adminLogin(req, res) {
  const admin = await Admin.findOne({ email: req.validatedBody.email }).select("+passwordHash +authVersion");
  if (!admin || !(await verifyPassword(admin.passwordHash, req.validatedBody.password))) {
    throw new ApiError(401, "Invalid email or password", "INVALID_ADMIN_CREDENTIALS");
  }
  if (admin.status !== ADMIN_STATUS.ACTIVE) {
    throw new ApiError(403, "Admin account is disabled", "ADMIN_ACCOUNT_DISABLED");
  }

  admin.lastLoginAt = new Date();
  await admin.save();
  await createAdminAuthSession({ admin, req, res });

  res.set("Cache-Control", "no-store").status(200).json({
    success: true,
    data: { admin: publicAdmin(admin), mustChangePassword: admin.mustChangePassword },
  });
}

export async function adminMe(req, res) {
  res.set("Cache-Control", "no-store").status(200).json({ success: true, data: { admin: publicAdmin(req.admin) } });
}

export async function adminRefresh(req, res) {
  const token = req.cookies?.[ADMIN_REFRESH_COOKIE_NAME];
  if (!token) throw new ApiError(401, "Admin refresh token is required", "ADMIN_REFRESH_REQUIRED");

  let payload;
  try {
    payload = verifyAdminRefreshToken(token);
  } catch (error) {
    clearAdminAuthCookies(res);
    const code = error instanceof jwt.TokenExpiredError ? "ADMIN_REFRESH_EXPIRED" : "INVALID_ADMIN_REFRESH_TOKEN";
    throw new ApiError(401, "Admin refresh token is invalid or expired", code);
  }

  const session = await AdminAuthSession.findOne({ sessionId: payload.sid }).select("+tokenHash");
  const admin = await Admin.findById(payload.sub).select("+authVersion");

  if (!session || session.revokedAt || session.expiresAt <= new Date() || !admin) {
    clearAdminAuthCookies(res);
    throw new ApiError(401, "Admin refresh session is no longer valid", "ADMIN_REFRESH_SESSION_INVALID");
  }
  if (admin.status !== ADMIN_STATUS.ACTIVE || (admin.authVersion ?? 0) !== payload.ver) {
    clearAdminAuthCookies(res);
    throw new ApiError(401, "Admin refresh session is no longer valid", "ADMIN_REFRESH_SESSION_INVALID");
  }

  const rotated = await rotateAdminAuthSession({ session, admin, token, req, res });
  if (!rotated) {
    clearAdminAuthCookies(res);
    throw new ApiError(401, "Admin refresh token reuse was detected", "ADMIN_REFRESH_REUSE_DETECTED");
  }

  res.set("Cache-Control", "no-store").status(200).json({ success: true, data: { admin: publicAdmin(admin) } });
}

export async function adminLogout(req, res) {
  const token = req.cookies?.[ADMIN_REFRESH_COOKIE_NAME];
  if (token) {
    try {
      const payload = verifyAdminRefreshToken(token);
      await AdminAuthSession.updateOne(
        { sessionId: payload.sid, revokedAt: null },
        { $set: { revokedAt: new Date(), revokeReason: "LOGOUT" } },
      );
    } catch {
      // Always clear cookies even when the presented refresh token is invalid.
    }
  }
  clearAdminAuthCookies(res);
  res.status(200).json({ success: true });
}

export async function adminChangePassword(req, res) {
  const admin = await Admin.findById(req.admin._id).select("+passwordHash +authVersion");
  if (!admin || !(await verifyPassword(admin.passwordHash, req.validatedBody.currentPassword))) {
    throw new ApiError(400, "Current password is incorrect", "CURRENT_PASSWORD_INCORRECT");
  }

  admin.passwordHash = await hashPassword(req.validatedBody.newPassword);
  admin.mustChangePassword = false;
  admin.passwordChangedAt = new Date();
  admin.authVersion += 1;
  await admin.save();
  await revokeAdminSessions(admin._id, "PASSWORD_CHANGED");
  await createAdminAuthSession({ admin, req, res });

  res.set("Cache-Control", "no-store").status(200).json({
    success: true,
    data: { admin: publicAdmin(admin) },
  });
}
