import mongoose from "mongoose";

const { Schema } = mongoose;

const authSessionSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      immutable: true,
      trim: true,
    },
    ambassadorId: {
      type: Schema.Types.ObjectId,
      ref: "CampusAmbassador",
      required: true,
      immutable: true,
    },
    tokenHash: {
      type: String,
      required: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      immutable: true,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
    rotatedAt: {
      type: Date,
      default: null,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    revokeReason: {
      type: String,
      trim: true,
      maxlength: 80,
      default: null,
    },
    userAgent: {
      type: String,
      maxlength: 512,
      default: null,
    },
    ipAddress: {
      type: String,
      maxlength: 96,
      default: null,
    },
  },
  {
    collection: "auth_sessions",
    timestamps: true,
    versionKey: false,
  },
);

authSessionSchema.index(
  { sessionId: 1 },
  { unique: true, name: "uq_auth_session_session_id" },
);
authSessionSchema.index(
  { ambassadorId: 1, revokedAt: 1, expiresAt: 1 },
  { name: "idx_auth_session_ambassador_active" },
);
authSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: "ttl_auth_session_expires_at" },
);

export const AuthSession =
  mongoose.models.AuthSession || mongoose.model("AuthSession", authSessionSchema);
