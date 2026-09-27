import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({

    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    ambassador: {
        type: Schema.Types.ObjectId,
        ref: 'Ambassador'
    },

    discountType: {
        type: String,
        enum: ['flat', 'percentage'],
        required: true
    },

    discountValue: {
        type: Number,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    usageCount: {
        type: Number,
        default: 0
    }
} , {timestamps: true});

export default mongoose.model('PromoCode', promoCodeSchema);