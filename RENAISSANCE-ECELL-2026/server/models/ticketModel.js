import mongoose from 'mongoose';
const { Schema } = mongoose;

const ticketSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  city: { type: String, required: true },
  
  ticketType: { 
    type: String, 
    enum: ['event-only', '1-day', '2-day'],
    required: true 
  },
  
  checkInDate: { type: Date },
  checkOutDate: { type: Date },
  accommodationPreferences: { type: String },
  
  transactionId: { 
    type: String, 
    required: true,
    unique: true
  },
  
  amount: { type: Number, required: true },
  amountPaid: { type: Number, required: true },

  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verificationRemarks: { type: String }

}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);
