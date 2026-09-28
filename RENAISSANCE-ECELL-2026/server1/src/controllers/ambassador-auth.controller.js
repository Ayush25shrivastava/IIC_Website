import jwt from "jsonwebtoken";
import { AMBASSADOR_STATUS } from "../constants/domain.js";
import { AuthSession, CampusAmbassador } from "../models/index.js";
import {
  createAuthSession,
  publicAmbassador,
  revokeAmbassadorSessions,
  rotateAuthSession,
  verifyAmbassadorPassword,
} from "../services/ambassador-auth.service.js";
import { ApiError } from "../utils/api-error.js";
import { ACCESS_COOKIE_NAME, clearAuthCookies, REFRESH_COOKIE_NAME } from "../utils/auth-cookies.js";
import { verifyAccessToken, verifyRefreshToken } from "../utils/tokens.js";

export async function loginAmbassador(req, res) {
  const { email, password } = req.validatedBody;

  const ambassador = await CampusAmbassador.findOne({ email }).select("+password +passwordHash +authVersion");
  if (!ambassador || !(await verifyAmbassadorPassword(ambassador, password))
    || ambassador.status !== AMBASSADOR_STATUS.ACTIVE || ambassador.role !== "CAMPUS_AMBASSADOR") {
    throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  ambassador.password = password;
  ambassador.passwordHash = undefined;
  ambassador.mustChangePassword = false;
  ambassador.lastLoginAt = new Date();
  await ambassador.save();
  await createAuthSession({ ambassador, req, res });

  res.set("Cache-Control", "no-store").status(200).json({
    success: true,
    data: {
      ambassador: publicAmbassador(ambassador),
      mustChangePassword: false,
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
  if (!session || session.ambassadorId.toString() !== payload.sub || session.revokedAt || session.expiresAt <= new Date()) {
    clearAuthCookies(res);
    throw new ApiError(401, "Refresh session is no longer valid", "REFRESH_SESSION_INVALID");
  }

  const ambassador = await CampusAmbassador.findById(payload.sub).select("+authVersion");
  if (!ambassador || ambassador.status !== AMBASSADOR_STATUS.ACTIVE || ambassador.role !== "CAMPUS_AMBASSADOR") {
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
      mustChangePassword: false,
    },
  });
}

export async function logoutAmbassador(req, res) {
  // Validate tokens separately from database work: database failures must not report a successful logout.
  const sessions = [];
  for (const [token, verify] of [
    [req.cookies?.[REFRESH_COOKIE_NAME], verifyRefreshToken],
    [req.cookies?.[ACCESS_COOKIE_NAME], verifyAccessToken],
  ]) {
    if (!token) continue;
    try {
      const payload = verify(token);
      if (payload.sid) sessions.push({ sessionId: payload.sid, ambassadorId: payload.sub });
    } catch (error) {
      if (!(error instanceof jwt.JsonWebTokenError)) throw error;
    }
  }
  if (sessions.length) {
    await AuthSession.updateMany(
      { $or: sessions, revokedAt: null },
      { $set: { revokedAt: new Date(), revokeReason: "LOGOUT" } },
    );
  }

  clearAuthCookies(res);
  res.set("Cache-Control", "no-store").status(200).json({ success: true });
}

export async function getCurrentAmbassador(req, res) {
  res.set("Cache-Control", "no-store").status(200).json({
    success: true,
    data: {
      ambassador: publicAmbassador(req.ambassador),
      mustChangePassword: false,
    },
  });
}

export async function changeAmbassadorPassword(req, res) {
  const { currentPassword, newPassword } = req.validatedBody;

  const ambassador = await CampusAmbassador.findById(req.ambassador._id).select(
    "+password +passwordHash +authVersion",
  );
  if (!ambassador) {
    throw new ApiError(401, "Authentication session is no longer valid", "ACCOUNT_NOT_FOUND");
  }

  if (!(await verifyAmbassadorPassword(ambassador, currentPassword))) {
    throw new ApiError(400, "Current password is incorrect", "CURRENT_PASSWORD_INCORRECT");
  }

  if (await verifyAmbassadorPassword(ambassador, newPassword)) {
    throw new ApiError(400, "New password must be different from the current password", "PASSWORD_REUSE_NOT_ALLOWED");
  }

  ambassador.password = newPassword;
  ambassador.passwordHash = undefined;
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
