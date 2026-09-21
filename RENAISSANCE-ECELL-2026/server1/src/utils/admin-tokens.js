import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

function commonSignOptions(expiresIn) {
  return {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    expiresIn,
    algorithm: "HS256",
  };
}

export function signAdminAccessToken(admin) {
  return jwt.sign(
    {
      typ: "admin_access",
      role: admin.role,
      ver: admin.authVersion ?? 0,
    },
    env.JWT_ACCESS_SECRET,
    {
      ...commonSignOptions(env.JWT_ACCESS_TTL_SECONDS),
      subject: admin._id.toString(),
      jwtid: crypto.randomUUID(),
    },
  );
}

export function signAdminRefreshToken(admin, sessionId) {
  return jwt.sign(
    { typ: "admin_refresh", sid: sessionId, ver: admin.authVersion ?? 0 },
    env.JWT_REFRESH_SECRET,
    {
      ...commonSignOptions(`${env.JWT_REFRESH_TTL_DAYS}d`),
      subject: admin._id.toString(),
      jwtid: crypto.randomUUID(),
    },
  );
}

function verify(token, secret, expectedType) {
  const payload = jwt.verify(token, secret, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    algorithms: ["HS256"],
  });
  if (!payload || typeof payload !== "object" || payload.typ !== expectedType) {
    throw new jwt.JsonWebTokenError(`Expected ${expectedType} token`);
  }
  return payload;
}

export function verifyAdminAccessToken(token) {
  return verify(token, env.JWT_ACCESS_SECRET, "admin_access");
}

export function verifyAdminRefreshToken(token) {
  return verify(token, env.JWT_REFRESH_SECRET, "admin_refresh");
}
