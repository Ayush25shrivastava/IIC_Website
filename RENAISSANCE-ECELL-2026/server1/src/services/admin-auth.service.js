import crypto from "node:crypto";
import { env } from "../config/env.js";
import { AdminAuthSession } from "../models/index.js";
import { setAdminAuthCookies } from "../utils/admin-auth-cookies.js";
import { signAdminAccessToken, signAdminRefreshToken } from "../utils/admin-tokens.js";
import { hashToken, tokenHashesEqual } from "../utils/tokens.js";

function expiry() {
  return new Date(Date.now() + env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
}

function requestMetadata(req) {
  return {
    userAgent: req.get("user-agent")?.slice(0, 512) || null,
    ipAddress: req.ip?.slice(0, 96) || null,
  };
}

export function publicAdmin(admin) {
  return {
    id: admin._id.toString(),
    adminId: admin.adminId,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    status: admin.status,
    mustChangePassword: admin.mustChangePassword,
    lastLoginAt: admin.lastLoginAt,
    passwordChangedAt: admin.passwordChangedAt,
  };
}

export async function createAdminAuthSession({ admin, req, res }) {
  const sessionId = crypto.randomUUID();
  const accessToken = signAdminAccessToken(admin);
  const refreshToken = signAdminRefreshToken(admin, sessionId);

  await AdminAuthSession.create({
    sessionId,
    adminId: admin._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: expiry(),
    ...requestMetadata(req),
  });

  setAdminAuthCookies(res, accessToken, refreshToken);
}

export async function rotateAdminAuthSession({ session, admin, token, req, res }) {
  const presentedHash = hashToken(token);
  if (!tokenHashesEqual(session.tokenHash, presentedHash)) {
    await AdminAuthSession.updateOne(
      { _id: session._id, revokedAt: null },
      { $set: { revokedAt: new Date(), revokeReason: "TOKEN_REUSE_DETECTED" } },
    );
    return false;
  }

  const accessToken = signAdminAccessToken(admin);
  const refreshToken = signAdminRefreshToken(admin, session.sessionId);
  const rotated = await AdminAuthSession.findOneAndUpdate(
    { _id: session._id, revokedAt: null, tokenHash: presentedHash },
    {
      $set: {
        tokenHash: hashToken(refreshToken),
        lastUsedAt: new Date(),
        rotatedAt: new Date(),
        ...requestMetadata(req),
      },
    },
    { new: true },
  );

  if (!rotated) return false;
  setAdminAuthCookies(res, accessToken, refreshToken);
  return true;
}

export function revokeAdminSessions(adminId, reason) {
  return AdminAuthSession.updateMany(
    { adminId, revokedAt: null },
    { $set: { revokedAt: new Date(), revokeReason: reason } },
  );
}
