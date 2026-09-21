import mongoose from "mongoose";
import { AMBASSADOR_STATUS } from "../constants/domain.js";

const { Schema } = mongoose;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{7,19}$/;
const AMBASSADOR_ID_PATTERN = /^CA-[A-Z0-9][A-Z0-9-]{2,31}$/;

const campusAmbassadorSchema = new Schema(
  {
    ambassadorId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      immutable: true,
      match: AMBASSADOR_ID_PATTERN,
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
    phone: {
      type: String,
      trim: true,
      maxlength: 24,
      match: PHONE_PATTERN,
      default: undefined,
    },
    college: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 180,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    status: {
      type: String,
      enum: Object.values(AMBASSADOR_STATUS),
      default: AMBASSADOR_STATUS.ACTIVE,
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
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    disabledAt: {
      type: Date,
      default: null,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "campus_ambassadors",
    timestamps: true,
    versionKey: false,
  },
);

campusAmbassadorSchema.index(
  { ambassadorId: 1 },
  { unique: true, name: "uq_campus_ambassador_ambassador_id" },
);
campusAmbassadorSchema.index(
  { email: 1 },
  { unique: true, name: "uq_campus_ambassador_email" },
);
campusAmbassadorSchema.index(
  { status: 1, college: 1 },
  { name: "idx_campus_ambassador_status_college" },
);
campusAmbassadorSchema.index(
  { createdAt: -1 },
  { name: "idx_campus_ambassador_created_at" },
);

campusAmbassadorSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.authVersion;
    return ret;
  },
});

export const CampusAmbassador =
  mongoose.models.CampusAmbassador ||
  mongoose.model("CampusAmbassador", campusAmbassadorSchema);
