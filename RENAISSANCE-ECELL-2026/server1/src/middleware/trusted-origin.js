import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

export function requireTrustedOrigin(req, _res, next) {
  const origin = req.get("origin");

  // Native/mobile clients and server-to-server tools may not send Origin.
  if (!origin || env.CLIENT_ORIGINS.includes(origin)) {
    next();
    return;
  }

  next(new ApiError(403, "Request origin is not trusted", "UNTRUSTED_ORIGIN"));
}
