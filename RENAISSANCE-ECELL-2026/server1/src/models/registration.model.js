import mongoose from "mongoose";
import {
  DISCOUNT_TYPE,
  PAYMENT_STATUS,
  REGISTRATION_STATUS,
} from "../constants/domain.js";

const { Schema } = mongoose;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{7,19}$/;
const REGISTRATION_ID_PATTERN = /^RNX-[A-Z0-9][A-Z0-9-]{4,39}$/;
const TICKET_ID_PATTERN = /^TKT-[A-Z0-9][A-Z0-9-]{4,39}$/;

const paymentScreenshotSchema = new Schema(
  {
    storageKey: { type: String, trim: true, maxlength: 500, default: undefined },
    url: { type: String, trim: true, maxlength: 2000, default: undefined },
    mimeType: { type: String, trim: true, maxlength: 100, default: undefined },
    sizeBytes: { type: Number, min: 1, default: undefined },
  },
  { _id: false },
);

const registrationSchema = new Schema(
  {
    registrationId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      immutable: true,
      match: REGISTRATION_ID_PATTERN,
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
      required: true,
      trim: true,
      maxlength: 24,
      match: PHONE_PATTERN,
    },
    college: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 180,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    packageCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 64,
    },
    packageName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    baseAmountPaise: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "baseAmountPaise must be an integer",
      },
    },
    discountAmountPaise: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "discountAmountPaise must be an integer",
      },
    },
    finalAmountPaise: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "finalAmountPaise must be an integer",
      },
    },
    promoCodeId: {
      type: Schema.Types.ObjectId,
      ref: "PromoCode",
      default: null,
      immutable: true,
    },
    promoCode: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 32,
      default: null,
      immutable: true,
    },
    ambassadorId: {
      type: Schema.Types.ObjectId,
      ref: "CampusAmbassador",
      default: null,
      immutable: true,
    },
    promoDiscountType: {
      type: String,
      enum: Object.values(DISCOUNT_TYPE),
      default: DISCOUNT_TYPE.NONE,
      immutable: true,
    },
    promoDiscountValue: {
      type: Number,
      min: 0,
      default: 0,
      immutable: true,
    },
    transactionId: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 160,
      default: undefined,
    },
    paymentScreenshot: {
      type: paymentScreenshotSchema,
      default: undefined,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.NOT_SUBMITTED,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(REGISTRATION_STATUS),
      default: REGISTRATION_STATUS.PENDING_VERIFICATION,
      required: true,
    },
    ticketId: {
      type: String,
      trim: true,
      uppercase: true,
      match: TICKET_ID_PATTERN,
      default: undefined,
      immutable: true,
    },
    verifiedByAdminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
  },
  {
    collection: "registrations",
    timestamps: true,
    versionKey: false,
  },
);

registrationSchema.pre("validate", function validateRegistration(next) {
  const expectedFinal = this.baseAmountPaise - this.discountAmountPaise;
  if (Number.isFinite(expectedFinal) && this.finalAmountPaise !== expectedFinal) {
    this.invalidate(
      "finalAmountPaise",
      "finalAmountPaise must equal baseAmountPaise minus discountAmountPaise",
    );
  }

  if (this.discountAmountPaise > this.baseAmountPaise) {
    this.invalidate("discountAmountPaise", "discount cannot exceed the base amount");
  }

  const attributionValues = [this.promoCodeId, this.promoCode, this.ambassadorId];
  const populatedAttributionCount = attributionValues.filter(Boolean).length;
  if (populatedAttributionCount !== 0 && populatedAttributionCount !== attributionValues.length) {
    this.invalidate(
      "promoCode",
      "promoCodeId, promoCode and ambassadorId must be stored together for referral attribution",
    );
  }

  if (!this.promoCodeId) {
    if (this.promoDiscountType !== DISCOUNT_TYPE.NONE || this.promoDiscountValue !== 0) {
      this.invalidate(
        "promoDiscountValue",
        "promo discount metadata cannot be set without a promo code",
      );
    }
  }

  if (this.promoDiscountType === DISCOUNT_TYPE.PERCENTAGE && this.promoDiscountValue > 100) {
    this.invalidate("promoDiscountValue", "percentage promo discount cannot exceed 100");
  }

  next();
});

registrationSchema.index(
  { registrationId: 1 },
  { unique: true, name: "uq_registration_registration_id" },
);
registrationSchema.index(
  { transactionId: 1 },
  {
    unique: true,
    name: "uq_registration_transaction_id",
    partialFilterExpression: { transactionId: { $type: "string" } },
  },
);
registrationSchema.index(
  { ticketId: 1 },
  {
    unique: true,
    name: "uq_registration_ticket_id",
    partialFilterExpression: { ticketId: { $type: "string" } },
  },
);
registrationSchema.index(
  { ambassadorId: 1, createdAt: -1 },
  {
    name: "idx_registration_ambassador_created_at",
    partialFilterExpression: { ambassadorId: { $type: "objectId" } },
  },
);
registrationSchema.index(
  { ambassadorId: 1, status: 1, createdAt: -1 },
  {
    name: "idx_registration_ambassador_status_created_at",
    partialFilterExpression: { ambassadorId: { $type: "objectId" } },
  },
);
registrationSchema.index(
  { promoCodeId: 1, createdAt: -1 },
  {
    name: "idx_registration_promo_created_at",
    partialFilterExpression: { promoCodeId: { $type: "objectId" } },
  },
);
registrationSchema.index(
  { status: 1, createdAt: -1 },
  { name: "idx_registration_status_created_at" },
);
registrationSchema.index({ email: 1 }, { name: "idx_registration_email" });
registrationSchema.index({ name: 1 }, { name: "idx_registration_name" });

export const Registration =
  mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);
