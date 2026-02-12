import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  
  password: { 
    type: String, 
    select: false 
  },

  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },

  avatar: { 
    type: String,
    default: "https://example.com/default-avatar.png" 
  },

  collegeName: { type: String, default: null },
  studentId: { type: String, default: null }, 
  branch: { type: String, default: null },
  year: { type: Number, min: 1, max: 5, default: null },
  phone: { type: String, default: null },

  role: { 
    type: String, 
    enum: ['student', 'admin', 'coordinator'], 
    default: 'student' 
  },
  
  registeredEvents: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],

  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'Team'
  }],
  
  isProfileComplete: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model('User', userSchema);