import mongoose from "mongoose";
import { DISCOUNT_TYPE } from "../constants/domain.js";

const { Schema } = mongoose;

const PROMO_CODE_PATTERN = /^[A-Z0-9][A-Z0-9-]{2,31}$/;

const promoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      immutable: true,
      minlength: 3,
      maxlength: 32,
      match: PROMO_CODE_PATTERN,
    },
    ambassadorId: {
      type: Schema.Types.ObjectId,
      ref: "CampusAmbassador",
      required: true,
      index: true,
    },
    discountType: {
      type: String,
      enum: Object.values(DISCOUNT_TYPE),
      default: DISCOUNT_TYPE.NONE,
      required: true,
    },
    discountValue: {
      type: Number,
      default: 0,
      min: 0,
      required: true,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "usageCount must be an integer",
      },
    },
    maxUses: {
      type: Number,
      default: null,
      min: 1,
      validate: {
        validator(value) {
          return value === null || Number.isInteger(value);
        },
        message: "maxUses must be null or a positive integer",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: true,
      required: true,
    },
    validFrom: {
      type: Date,
      default: null,
    },
    validUntil: {
      type: Date,
      default: null,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "promo_codes",
    timestamps: true,
    versionKey: false,
  },
);

promoCodeSchema.pre("validate", function validatePromoCode(next) {
  if (this.discountType === DISCOUNT_TYPE.NONE && this.discountValue !== 0) {
    this.invalidate("discountValue", "discountValue must be 0 when discountType is NONE");
  }

  if (this.discountType === DISCOUNT_TYPE.PERCENTAGE && this.discountValue > 100) {
    this.invalidate("discountValue", "percentage discount cannot exceed 100");
  }

  if (this.maxUses !== null && this.usageCount > this.maxUses) {
    this.invalidate("usageCount", "usageCount cannot exceed maxUses");
  }

  if (this.validFrom && this.validUntil && this.validUntil < this.validFrom) {
    this.invalidate("validUntil", "validUntil must be after validFrom");
  }

  next();
});

promoCodeSchema.index(
  { code: 1 },
  { unique: true, name: "uq_promo_code_code" },
);
promoCodeSchema.index(
  { ambassadorId: 1, isPrimary: 1 },
  {
    unique: true,
    name: "uq_primary_promo_per_ambassador",
    partialFilterExpression: { isPrimary: true },
  },
);
promoCodeSchema.index(
  { isActive: 1, validFrom: 1, validUntil: 1 },
  { name: "idx_promo_code_active_validity" },
);
promoCodeSchema.index(
  { archivedAt: 1, createdAt: -1 },
  { name: "idx_promo_code_archived_created_at" },
);

export const PromoCode =
  mongoose.models.PromoCode || mongoose.model("PromoCode", promoCodeSchema);
