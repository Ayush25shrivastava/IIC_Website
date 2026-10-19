import mongoose from 'mongoose';
import { randomBytes } from 'node:crypto';
const { Schema } = mongoose;

const ticketScanSchema = new Schema({
  stageId: { type: String },
  stageName: { type: String, trim: true, maxlength: 50 },
  // Kept for existing numeric scans and older client builds.
  stage: { type: Number, min: 1, max: 3 },
  scannedAt: { type: Date, required: true, default: Date.now },
  scannedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  scannedByRole: { type: String, enum: ['ADMIN', 'VOLUNTEER_SCANNER'] },
  scannedByEmail: { type: String, trim: true, lowercase: true, maxlength: 254 },
}, { _id: false });

const ticketSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  city: { type: String, required: true },
  teamName: { type: String, trim: true },

  ticketType: {
    type: String,
    enum: ['event-standard', 'event-premium', 'event-elite', 'accom-standard', 'accom-premium', 'accom-elite'],
    required: true
  },
  
  tshirtSize: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', null],
    default: null
  },
  
  accommodationDays: { type: Number, min: 0, max: 4, default: 0 },

  checkInDate: { type: Date },
  checkOutDate: { type: Date },
  accommodationPreferences: { type: String },

  transactionId: {
    type: String,
    required: true
  },

  ticketId: {
    type: String,
    unique: true,
    required: true,
    default: () => `REN-${randomBytes(6).toString('hex').toUpperCase()}`
  },

  amount: { type: Number, required: true },
  amountPaid: { type: Number, required: true },

  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },

  verifiedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  verificationRemarks: { type: String },
  editedAt: { type: Date },
  editedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  stageScans: { type: [ticketScanSchema], default: [] }

}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);
