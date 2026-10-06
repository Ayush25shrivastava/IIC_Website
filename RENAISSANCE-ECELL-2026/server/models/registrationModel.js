import mongoose from 'mongoose';
const { Schema } = mongoose;

const registrationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },

    
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        default: null
    },

    registrationType: {
        type: String,
        enum: ['individual', 'team'],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ['free', 'paid', 'pending'],
        default: 'free'
    },

    submissionLink: {
        type: String,
        default: null
    },

    submittedAt: {
        type: Date,
        default: null
    },

    status: {
        type: String,
        enum: ['registered', 'submitted', 'disqualified'],
        default: 'registered'
    }

}, { timestamps: true });


registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
