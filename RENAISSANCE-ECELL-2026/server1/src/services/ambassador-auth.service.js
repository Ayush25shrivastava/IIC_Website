import crypto from "node:crypto";
import { env } from "../config/env.js";
import { AuthSession } from "../models/index.js";
import { setAuthCookies } from "../utils/auth-cookies.js";
import { verifyPassword } from "../utils/password.js";
import { hashToken, signAccessToken, signRefreshToken, tokenHashesEqual } from "../utils/tokens.js";

function refreshExpiryDate() {
  return new Date(Date.now() + env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
}

export async function verifyAmbassadorPassword(ambassador, password) {
  if (typeof ambassador.password === "string") return ambassador.password === password;
  // Legacy hashes are verified only to preserve access during conversion.
  if (typeof ambassador.passwordHash === "string") return verifyPassword(ambassador.passwordHash, password);
  return false;
}

function requestMetadata(req) {
  return {
    userAgent: req.get("user-agent")?.slice(0, 512) || null,
    ipAddress: req.ip?.slice(0, 96) || null,
  };
}

export function publicAmbassador(ambassador) {
  return {
    id: ambassador._id.toString(),
    ambassadorId: ambassador.ambassadorId,
    name: ambassador.name,
    email: ambassador.email,
    phone: ambassador.phone ?? null,
    college: ambassador.college,
    status: ambassador.status,
    // Retain the response field for older clients; password changes are optional.
    mustChangePassword: false,
    lastLoginAt: ambassador.lastLoginAt,
    passwordChangedAt: ambassador.passwordChangedAt,
  };
}

export async function createAuthSession({ ambassador, req, res }) {
  const sessionId = crypto.randomUUID();
  const accessToken = signAccessToken(ambassador, sessionId);
  const refreshToken = signRefreshToken(ambassador, sessionId);

  await AuthSession.create({
    sessionId,
    ambassadorId: ambassador._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: refreshExpiryDate(),
    ...requestMetadata(req),
  });

  setAuthCookies(res, accessToken, refreshToken);
  return { accessToken, refreshToken, sessionId };
}

export async function rotateAuthSession({ session, ambassador, presentedRefreshToken, req, res }) {
  const presentedHash = hashToken(presentedRefreshToken);
  const storedHash = session.tokenHash;

  if (!tokenHashesEqual(storedHash, presentedHash)) {
    await AuthSession.updateOne(
      { _id: session._id, revokedAt: null },
      { $set: { revokedAt: new Date(), revokeReason: "TOKEN_REUSE_DETECTED" } },
    );
    return false;
  }

  const accessToken = signAccessToken(ambassador, session.sessionId);
  const refreshToken = signRefreshToken(ambassador, session.sessionId);
  const newHash = hashToken(refreshToken);
  const now = new Date();

  const rotated = await AuthSession.findOneAndUpdate(
    {
      _id: session._id,
      revokedAt: null,
      tokenHash: presentedHash,
    },
    {
      $set: {
        tokenHash: newHash,
        lastUsedAt: now,
        rotatedAt: now,
        ...requestMetadata(req),
      },
    },
    { new: true },
  );

  if (!rotated) return false;

  setAuthCookies(res, accessToken, refreshToken);
  return true;
}

export function revokeAmbassadorSessions(ambassadorId, reason) {
  return AuthSession.updateMany(
    { ambassadorId, revokedAt: null },
    { $set: { revokedAt: new Date(), revokeReason: reason } },
  );
}
