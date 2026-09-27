import mongoose from "mongoose";

const taskModelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        description: String
    },

    ambassador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ambassador',
        required: true
    },

    status: {
        type: String,
        enum: ['Assigned', 'In Progress', 'Completed'],
        default: 'Assigned'
    },

    completionRemarks: {
        type: String,
        default: null
    },

}, { timestamps: true })


export default mongoose.model('Task', taskModelSchema)