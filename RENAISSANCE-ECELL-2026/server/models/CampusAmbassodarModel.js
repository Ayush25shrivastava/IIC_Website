import mongoose from "mongoose";

const ambassadorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
        required: true,
        select: false
    },

    collegeName: {
        type: String,
    },

    promotionCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PromoCode',
        unique: true,
    },
    
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});


export default mongoose.model('Ambassador', ambassadorSchema);