import { createHash, timingSafeEqual } from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import {
    VOLUNTEER_SCANNER_AUDIENCE,
    VOLUNTEER_SCANNER_COOKIE,
    volunteerScannerCookieOptions,
} from "../middleware/volunteer-scanner-auth.js";

function constantTimeEqual(left, right) {
    const digest = (value) => createHash("sha256").update(value).digest();
    return timingSafeEqual(digest(left), digest(right));
}

export const loginVolunteerScanner = asyncHandler(async (req, res) => {
    if (!env.VOLUNTEER_SCANNER_EMAIL || !env.VOLUNTEER_SCANNER_PASSWORD) {
        throw new ApiError(503, "Volunteer scanner sign-in is not configured", "VOLUNTEER_SCANNER_NOT_CONFIGURED");
    }

    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
        throw new ApiError(400, "Email and password are required", "VOLUNTEER_SCANNER_CREDENTIALS_REQUIRED");
    }

    const emailMatches = constantTimeEqual(email.trim().toLowerCase(), env.VOLUNTEER_SCANNER_EMAIL.toLowerCase());
    const passwordMatches = constantTimeEqual(password, env.VOLUNTEER_SCANNER_PASSWORD);
    if (!emailMatches || !passwordMatches) {
        throw new ApiError(401, "Email or password is incorrect", "VOLUNTEER_SCANNER_INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
        { sub: "volunteer-scanner", role: "VOLUNTEER_SCANNER" },
        env.JWT_ACCESS_SECRET,
        { expiresIn: "8h", issuer: env.JWT_ISSUER, audience: VOLUNTEER_SCANNER_AUDIENCE },
    );

    res.cookie(VOLUNTEER_SCANNER_COOKIE, token, volunteerScannerCookieOptions());
    res.set("Cache-Control", "no-store").status(200).json({
        success: true,
        data: { email: env.VOLUNTEER_SCANNER_EMAIL },
    });
});

export const getVolunteerScannerSession = asyncHandler(async (req, res) => {
    res.set("Cache-Control", "no-store").status(200).json({
        success: true,
        data: { email: req.volunteerScanner.email },
    });
});

export const logoutVolunteerScanner = asyncHandler(async (_req, res) => {
    const { maxAge: _maxAge, ...options } = volunteerScannerCookieOptions();
    res.clearCookie(VOLUNTEER_SCANNER_COOKIE, options);
    res.set("Cache-Control", "no-store").status(200).json({ success: true });
});
