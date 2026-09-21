import mongoose from "mongoose";

const { Schema } = mongoose;

const adminAuthSessionSchema = new Schema(
  {
    sessionId: { type: String, required: true, immutable: true, trim: true },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      immutable: true,
    },
    tokenHash: { type: String, required: true, select: false },
    expiresAt: { type: Date, required: true, immutable: true },
    lastUsedAt: { type: Date, default: Date.now },
    rotatedAt: { type: Date, default: null },
    revokedAt: { type: Date, default: null },
    revokeReason: { type: String, trim: true, maxlength: 80, default: null },
    userAgent: { type: String, maxlength: 512, default: null },
    ipAddress: { type: String, maxlength: 96, default: null },
  },
  { collection: "admin_auth_sessions", timestamps: true, versionKey: false },
);

adminAuthSessionSchema.index(
  { sessionId: 1 },
  { unique: true, name: "uq_admin_auth_session_session_id" },
);
adminAuthSessionSchema.index(
  { adminId: 1, revokedAt: 1, expiresAt: 1 },
  { name: "idx_admin_auth_session_admin_active" },
);
adminAuthSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: "ttl_admin_auth_session_expires_at" },
);

export const AdminAuthSession =
  mongoose.models.AdminAuthSession ||
  mongoose.model("AdminAuthSession", adminAuthSessionSchema);
