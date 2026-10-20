import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { VolunteerScanner } from "../models/index.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import {
  VOLUNTEER_SCANNER_AUDIENCE,
  VOLUNTEER_SCANNER_COOKIE,
  volunteerScannerCookieOptions,
} from "../middleware/volunteer-scanner-auth.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerVolunteerScanner = asyncHandler(async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = req.body?.password;
  if (name.length < 2 || name.length > 120 || !EMAIL_PATTERN.test(email) || typeof password !== "string" || password.length < 8 || password.length > 128) {
    throw new ApiError(400, "Enter your name, a valid email, and a password with at least 8 characters.", "VOLUNTEER_REGISTRATION_INVALID");
  }

  try {
    await VolunteerScanner.create({ name, email, passwordHash: await hashPassword(password), status: "PENDING" });
  } catch (error) {
    if (error.code === 11000) throw new ApiError(409, "An account or access request already exists for this email.", "VOLUNTEER_EMAIL_EXISTS");
    throw error;
  }

  res.status(201).json({ success: true, data: { status: "PENDING" }, message: "Access request submitted. An admin must approve it before you can scan tickets." });
});

export const loginVolunteerScanner = asyncHandler(async (req, res) => {
  const { email: rawEmail, password } = req.body || {};
  if (typeof rawEmail !== "string" || typeof password !== "string" || !rawEmail.trim() || !password) {
    throw new ApiError(400, "Email and password are required", "VOLUNTEER_SCANNER_CREDENTIALS_REQUIRED");
  }

  const volunteer = await VolunteerScanner.findOne({ email: rawEmail.trim().toLowerCase() }).select("+passwordHash +authVersion");
  if (!volunteer || !(await verifyPassword(volunteer.passwordHash, password))) {
    throw new ApiError(401, "Email or password is incorrect", "VOLUNTEER_SCANNER_INVALID_CREDENTIALS");
  }
  if (volunteer.status !== "ACTIVE") {
    const message = volunteer.status === "PENDING"
      ? "Your access request is awaiting admin approval."
      : "This volunteer scanner account is not approved for scanning.";
    throw new ApiError(403, message, "VOLUNTEER_SCANNER_NOT_APPROVED");
  }

  volunteer.lastLoginAt = new Date();
  await volunteer.save();
  const token = jwt.sign(
    { sub: volunteer._id.toString(), role: "VOLUNTEER_SCANNER", authVersion: volunteer.authVersion },
    env.JWT_ACCESS_SECRET,
    { expiresIn: "8h", issuer: env.JWT_ISSUER, audience: VOLUNTEER_SCANNER_AUDIENCE },
  );
  res.cookie(VOLUNTEER_SCANNER_COOKIE, token, volunteerScannerCookieOptions());
  res.set("Cache-Control", "no-store").status(200).json({ success: true, data: { email: volunteer.email, name: volunteer.name } });
});

export const getVolunteerScannerSession = asyncHandler(async (req, res) => {
  res.set("Cache-Control", "no-store").status(200).json({ success: true, data: { email: req.volunteerScanner.email, name: req.volunteerScanner.name } });
});

export const logoutVolunteerScanner = asyncHandler(async (_req, res) => {
  const { maxAge: _maxAge, ...options } = volunteerScannerCookieOptions();
  res.clearCookie(VOLUNTEER_SCANNER_COOKIE, options);
  res.set("Cache-Control", "no-store").status(200).json({ success: true });
});

export const adminListVolunteerScanners = asyncHandler(async (_req, res) => {
  const volunteers = await VolunteerScanner.find().select("name email status approvedAt lastLoginAt createdAt").sort({ createdAt: -1 }).lean();
  res.set("Cache-Control", "no-store").status(200).json({ success: true, data: { volunteers } });
});

export const adminSetVolunteerScannerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body || {};
  if (!["ACTIVE", "REJECTED", "DISABLED"].includes(status)) {
    throw new ApiError(400, "Status must be ACTIVE, REJECTED, or DISABLED.", "VOLUNTEER_STATUS_INVALID");
  }
  const volunteer = await VolunteerScanner.findById(req.params.id).select("+authVersion");
  if (!volunteer) throw new ApiError(404, "Volunteer request not found.", "VOLUNTEER_NOT_FOUND");
  const wasActive = volunteer.status === "ACTIVE";
  volunteer.status = status;
  volunteer.approvedAt = status === "ACTIVE" ? (volunteer.approvedAt || new Date()) : null;
  volunteer.approvedBy = status === "ACTIVE" ? req.admin._id : null;
  if (wasActive && status !== "ACTIVE") volunteer.authVersion += 1;
  await volunteer.save();
  res.status(200).json({ success: true, data: { volunteer: { id: volunteer.id, name: volunteer.name, email: volunteer.email, status: volunteer.status, approvedAt: volunteer.approvedAt } } });
});
