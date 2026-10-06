import jwt from "jsonwebtoken";
import { AMBASSADOR_STATUS } from "../constants/domain.js";
import { AuthSession, CampusAmbassador } from "../models/index.js";
import {
  createAuthSession,
  publicAmbassador,
  revokeAmbassadorSessions,
  rotateAuthSession,
} from "../services/ambassador-auth.service.js";
import { ApiError } from "../utils/api-error.js";
import { clearAuthCookies, REFRESH_COOKIE_NAME } from "../utils/auth-cookies.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { hashToken, verifyRefreshToken } from "../utils/tokens.js";

export async function loginAmbassador(req, res) {
  const { email, password } = req.validatedBody;

  const ambassador = await CampusAmbassador.findOne({ email }).select("+passwordHash +authVersion");
  if (!ambassador || !(await verifyPassword(ambassador.passwordHash, password))) {
    throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  if (ambassador.status !== AMBASSADOR_STATUS.ACTIVE) {
    throw new ApiError(403, "Campus ambassador account is not active", "ACCOUNT_DISABLED");
  }

  ambassador.lastLoginAt = new Date();
  await ambassador.save();
  await createAuthSession({ ambassador, req, res });

  res.set("Cache-Control", "no-store").status(200).json({
    success: true,
    data: {
      ambassador: publicAmbassador(ambassador),
      mustChangePassword: ambassador.mustChangePassword,
    },
  });
}

export async function refreshAmbassadorSession(req, res) {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required", "REFRESH_TOKEN_REQUIRED");
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    clearAuthCookies(res);
    const code = error instanceof jwt.TokenExpiredError ? "REFRESH_TOKEN_EXPIRED" : "INVALID_REFRESH_TOKEN";
    throw new ApiError(401, "Refresh token is invalid or expired", code);
  }

  const session = await AuthSession.findOne({ sessionId: payload.sid }).select("+tokenHash");
  if (!session || session.revokedAt || session.expiresAt <= new Date()) {
    clearAuthCookies(res);
    throw new ApiError(401, "Refresh session is no longer valid", "REFRESH_SESSION_INVALID");
  }

  const ambassador = await CampusAmbassador.findById(payload.sub).select("+authVersion");
  if (!ambassador || ambassador.status !== AMBASSADOR_STATUS.ACTIVE) {
    clearAuthCookies(res);
    throw new ApiError(401, "Refresh session is no longer valid", "REFRESH_SESSION_INVALID");
  }

  if ((ambassador.authVersion ?? 0) !== payload.ver) {
    await AuthSession.updateOne(
      { _id: session._id, revokedAt: null },
      { $set: { revokedAt: new Date(), revokeReason: "AUTH_VERSION_CHANGED" } },
    );
    clearAuthCookies(res);
    throw new ApiError(401, "Refresh session is no longer valid", "AUTH_VERSION_MISMATCH");
  }

  const rotated = await rotateAuthSession({
    session,
    ambassador,
    presentedRefreshToken: refreshToken,
    req,
    res,
  });

  if (!rotated) {
    clearAuthCookies(res);
    throw new ApiError(401, "Refresh token reuse was detected", "REFRESH_TOKEN_REUSED");
  }

  res.set("Cache-Control", "no-store").status(200).json({
    success: true,
    data: {
      ambassador: publicAmbassador(ambassador),
      mustChangePassword: ambassador.mustChangePassword,
    },
  });
}

export async function logoutAmbassador(req, res) {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      await AuthSession.updateOne(
        { sessionId: payload.sid, tokenHash: hashToken(refreshToken), revokedAt: null },
        { $set: { revokedAt: new Date(), revokeReason: "LOGOUT" } },
      );
    } catch {
      // Always clear browser cookies even when the submitted refresh token is stale.
    }
  }

  clearAuthCookies(res);
  res.set("Cache-Control", "no-store").status(200).json({ success: true });
}

export async function getCurrentAmbassador(req, res) {
  res.set("Cache-Control", "no-store").status(200).json({
    success: true,
    data: {
      ambassador: publicAmbassador(req.ambassador),
      mustChangePassword: req.ambassador.mustChangePassword,
    },
  });
}

export async function changeAmbassadorPassword(req, res) {
  const { currentPassword, newPassword } = req.validatedBody;

  const ambassador = await CampusAmbassador.findById(req.ambassador._id).select(
    "+passwordHash +authVersion",
  );
  if (!ambassador) {
    throw new ApiError(401, "Authentication session is no longer valid", "ACCOUNT_NOT_FOUND");
  }

  if (!(await verifyPassword(ambassador.passwordHash, currentPassword))) {
    throw new ApiError(400, "Current password is incorrect", "CURRENT_PASSWORD_INCORRECT");
  }

  if (await verifyPassword(ambassador.passwordHash, newPassword)) {
    throw new ApiError(400, "New password must be different from the current password", "PASSWORD_REUSE_NOT_ALLOWED");
  }

  ambassador.passwordHash = await hashPassword(newPassword);
  ambassador.mustChangePassword = false;
  ambassador.passwordChangedAt = new Date();
  ambassador.authVersion = (ambassador.authVersion ?? 0) + 1;
  await ambassador.save();

  await revokeAmbassadorSessions(ambassador._id, "PASSWORD_CHANGED");
  clearAuthCookies(res);
  await createAuthSession({ ambassador, req, res });

  res.set("Cache-Control", "no-store").status(200).json({
    success: true,
    data: {
      ambassador: publicAmbassador(ambassador),
      mustChangePassword: false,
    },
  });
}
