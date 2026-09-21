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

export function signAccessToken(ambassador) {
  return jwt.sign(
    {
      typ: "access",
      aid: ambassador.ambassadorId,
      ver: ambassador.authVersion ?? 0,
    },
    env.JWT_ACCESS_SECRET,
    {
      ...commonSignOptions(env.JWT_ACCESS_TTL_SECONDS),
      subject: ambassador._id.toString(),
      jwtid: crypto.randomUUID(),
    },
  );
}

export function signRefreshToken(ambassador, sessionId) {
  return jwt.sign(
    {
      typ: "refresh",
      sid: sessionId,
      ver: ambassador.authVersion ?? 0,
    },
    env.JWT_REFRESH_SECRET,
    {
      ...commonSignOptions(`${env.JWT_REFRESH_TTL_DAYS}d`),
      subject: ambassador._id.toString(),
      jwtid: crypto.randomUUID(),
    },
  );
}

function verifyToken(token, secret, expectedType) {
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

export function verifyAccessToken(token) {
  return verifyToken(token, env.JWT_ACCESS_SECRET, "access");
}

export function verifyRefreshToken(token) {
  return verifyToken(token, env.JWT_REFRESH_SECRET, "refresh");
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function tokenHashesEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;

  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
