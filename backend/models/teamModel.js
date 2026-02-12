import mongoose from 'mongoose';
const { Schema } = mongoose;

const teamSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  
  event: { 
    type: Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },

  leader: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  members: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],

  teamCode: { 
    type: String, 
    unique: true,
    required: true 
  },
  
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'disqualified'],
    default: 'pending'
  }

}, { timestamps: true });

// PRE-SAVE HOOK: Validation logic for Team Size
teamSchema.pre('save', async function(next) {
  if (this.isModified('members')) {
    const event = await mongoose.model('Event').findById(this.event);
    
    // Check Max Size
    if (this.members.length > event.maxTeamSize) {
      throw new Error(`Team size cannot exceed ${event.maxTeamSize} members.`);
    }
  }
  next();
});

export default mongoose.model('Team', teamSchema);