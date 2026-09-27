import mongoose from "mongoose";

const ticketRegistrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // "1-Day Accommodation", etc.

    type: {
        type: String,
        enum: ['1Day', '2Day', 'EventOnly'],
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    includesAccommodation: {
        type: Boolean,
        default: false
    },

    benefits: [{ type: String }],
    // meals, event access, etc.

    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});


export default mongoose.model('TicketRegistration', ticketRegistrationSchema);