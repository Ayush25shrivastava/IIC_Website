import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { asyncHandler } from "./async-handler.js";
import { ApiError } from "../utils/api-error.js";

export const VOLUNTEER_SCANNER_COOKIE = "rn_volunteer_scanner";
export const VOLUNTEER_SCANNER_AUDIENCE = "renaissance-volunteer-scanner";

export function volunteerScannerCookieOptions() {
    return {
        httpOnly: true,
        secure: env.AUTH_COOKIE_SECURE,
        sameSite: env.AUTH_COOKIE_SAME_SITE,
        domain: env.AUTH_COOKIE_DOMAIN,
        path: "/",
        maxAge: 8 * 60 * 60 * 1000,
    };
}

export const requireVolunteerScanner = asyncHandler(async (req, _res, next) => {
    const token = req.cookies?.[VOLUNTEER_SCANNER_COOKIE];
    if (!token) throw new ApiError(401, "Volunteer scanner sign-in is required", "VOLUNTEER_SCANNER_AUTH_REQUIRED");

    let payload;
    try {
        payload = jwt.verify(token, env.JWT_ACCESS_SECRET, {
            issuer: env.JWT_ISSUER,
            audience: VOLUNTEER_SCANNER_AUDIENCE,
        });
    } catch {
        throw new ApiError(401, "Volunteer scanner session is invalid or expired", "VOLUNTEER_SCANNER_SESSION_INVALID");
    }

    if (payload.role !== "VOLUNTEER_SCANNER" || payload.sub !== "volunteer-scanner") {
        throw new ApiError(401, "Volunteer scanner session is invalid", "VOLUNTEER_SCANNER_SESSION_INVALID");
    }

    req.volunteerScanner = { email: env.VOLUNTEER_SCANNER_EMAIL };
    next();
});
