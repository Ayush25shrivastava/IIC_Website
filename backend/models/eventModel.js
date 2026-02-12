import mongoose from 'mongoose';
const { Schema } = mongoose;

const eventSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { type: String, required: true },
  rules: { type: String },

  category: { 
    type: String, 
    enum: ['Technical', 'Cultural', 'Gaming', 'Workshop'],
    required: true
  },
  
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  image: { type: String },

  eventType: {
    type: String,
    enum: ['Solo', 'Team'],
    default: 'Solo'
  },
  minTeamSize: { 
    type: Number, 
    default: 1 
  },
  maxTeamSize: { 
    type: Number, 
    default: 1 
  },

  registrationFee: { type: Number, default: 0 },
  isRegistrationOpen: { type: Boolean, default: true },

  participants: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  teams: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Team' 
  }]

}, { timestamps: true });

export default mongoose.model('Event', eventSchema);