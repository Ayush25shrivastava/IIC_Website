import mongoose from "mongoose";

const ticketRegistrationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        collegeName: {
            type: String
        },
        package: {
            type: Schema.Types.ObjectId,
            ref: 'Package',
            required: true
        },
        promoCode: {
            type: Schema.Types.ObjectId,
            ref: 'PromoCode',
            default: null
        },

        discountApplied: {
            type: Number,
            default: 0
        },

        finalAmount: {
            type: Number,
            required: true
        },
        transactionId: {
            type: String,
            required: true,
            unique: true
        },

        paymentScreenshot: {
            type: String,
            required: true

        }, // stored file path/URL

        status: {
            type: String,
            enum: ['Pending', 'Verified', 'Rejected'],
            default: 'Pending'
        },

        rejectionReason: {
            type: String,
            default: null
        },


        ticketId: {
            type: String,
            unique: true,
            sparse: true
        }, // set only on approval

        verifiedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

          verifiedAt: {
            type : Date
          }
    } , {timestamps: true}
)

export default mongoose.model('TicketRegistration', ticketRegistrationSchema);