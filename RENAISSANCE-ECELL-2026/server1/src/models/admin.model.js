import mongoose from "mongoose";
import { ADMIN_ROLE, ADMIN_STATUS } from "../constants/domain.js";

const { Schema } = mongoose;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ADMIN_ID_PATTERN = /^AD-[A-Z0-9][A-Z0-9-]{2,31}$/;

const adminSchema = new Schema(
  {
    adminId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      immutable: true,
      match: ADMIN_ID_PATTERN,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: EMAIL_PATTERN,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ADMIN_ROLE),
      default: ADMIN_ROLE.ADMIN,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ADMIN_STATUS),
      default: ADMIN_STATUS.ACTIVE,
      required: true,
    },
    mustChangePassword: {
      type: Boolean,
      default: true,
      required: true,
    },
    authVersion: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
      select: false,
    },
    passwordChangedAt: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "admins",
    timestamps: true,
    versionKey: false,
  },
);

adminSchema.index({ adminId: 1 }, { unique: true, name: "uq_admin_admin_id" });
adminSchema.index({ email: 1 }, { unique: true, name: "uq_admin_email" });
adminSchema.index({ status: 1, role: 1 }, { name: "idx_admin_status_role" });

adminSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.authVersion;
    return ret;
  },
});

export const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
