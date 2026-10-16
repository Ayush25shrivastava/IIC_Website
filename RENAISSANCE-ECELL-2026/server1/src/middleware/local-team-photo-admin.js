import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

export function requireLocalTeamPhotoAdmin(req, _res, next) {
  const loopback = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];
  let localOrigin = false;
  try {
    const origin = req.get("origin");
    localOrigin = env.CLIENT_ORIGINS.includes(origin) && ["localhost", "127.0.0.1", "[::1]"].includes(new URL(origin).hostname);
  } catch { /* An absent or malformed origin cannot authorize cloud changes. */ }
  if (env.NODE_ENV !== "development" || !env.LOCAL_TEAM_PHOTO_ADMIN || !loopback.includes(req.socket.remoteAddress) || !["localhost", "127.0.0.1", "::1", "[::1]"].includes(req.hostname) || !localOrigin) {
    return next(new ApiError(403, "Local photo management requires a localhost development server and LOCAL_TEAM_PHOTO_ADMIN=true.", "LOCAL_PHOTO_ADMIN_DENIED"));
  }
  next();
}
