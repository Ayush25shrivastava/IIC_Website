import mongoose from "mongoose";

const { Schema } = mongoose;

const volunteerScannerSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  status: { type: String, enum: ["PENDING", "ACTIVE", "REJECTED", "DISABLED"], default: "PENDING", required: true },
  authVersion: { type: Number, min: 0, default: 0, required: true, select: false },
  approvedAt: { type: Date, default: null },
  approvedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
  lastLoginAt: { type: Date, default: null },
}, { timestamps: true, collection: "volunteer_scanners" });

volunteerScannerSchema.index({ email: 1 }, { unique: true });

export const VolunteerScanner = mongoose.models.VolunteerScanner
  || mongoose.model("VolunteerScanner", volunteerScannerSchema);
