import mongoose from "mongoose";

const { Schema } = mongoose;

const ticketStageSchema = new Schema({
    stageId: { type: String, required: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    createdAt: { type: Date, required: true, default: Date.now },
}, { _id: false });

const ticketStageConfigSchema = new Schema({
    ticketType: {
        type: String,
        required: true,
        enum: ["event-standard", "event-premium", "event-elite", "accom-standard", "accom-premium", "accom-elite"],
    },
    stages: {
        type: [ticketStageSchema],
        default: [],
    },
}, { timestamps: true, collection: "ticket_stage_configs" });

ticketStageConfigSchema.index({ ticketType: 1 }, { unique: true });

export const TicketStageConfig = mongoose.models.TicketStageConfig
    || mongoose.model("TicketStageConfig", ticketStageConfigSchema);
