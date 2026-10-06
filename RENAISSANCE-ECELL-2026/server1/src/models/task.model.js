import mongoose from "mongoose";
import { TASK_STATUS } from "../constants/domain.js";

const { Schema } = mongoose;

const TASK_ID_PATTERN = /^TASK-[A-Z0-9][A-Z0-9-]{2,39}$/;

const taskSchema = new Schema(
  {
    taskId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      immutable: true,
      match: TASK_ID_PATTERN,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 180,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 2000,
    },
    ambassadorId: {
      type: Schema.Types.ObjectId,
      ref: "CampusAmbassador",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.ASSIGNED,
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    completionDetails: {
      type: String,
      trim: true,
      maxlength: 4000,
      default: "",
    },
    assignedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    createdByAdminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    collection: "ambassador_tasks",
    timestamps: true,
    versionKey: false,
  },
);

taskSchema.index({ taskId: 1 }, { unique: true, name: "uq_task_task_id" });
taskSchema.index(
  { ambassadorId: 1, status: 1, createdAt: -1 },
  { name: "idx_task_ambassador_status_created_at" },
);
taskSchema.index(
  { status: 1, updatedAt: -1 },
  { name: "idx_task_status_updated_at" },
);

export const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
