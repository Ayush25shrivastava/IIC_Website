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
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    collegeRegNo: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      default: ''
    }
  },

  members: [{
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    collegeRegNo: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      default: ''
    }
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


teamSchema.pre('save', async function () {
  if (this.isModified('members') || this.isNew) {
    const event = await mongoose.model('Event').findById(this.event);

    if (!event) {
      throw new Error('Event not found');
    }

    
    const totalMembers = 1 + this.members.length;

    
    if (totalMembers > event.maxTeamSize) {
      throw new Error(`Team size cannot exceed ${event.maxTeamSize} members. Current: ${totalMembers}`);
    }

    
    if (totalMembers < event.minTeamSize) {
      throw new Error(`Team must have at least ${event.minTeamSize} members. Current: ${totalMembers}`);
    }
  }
});

export default mongoose.model('Team', teamSchema);