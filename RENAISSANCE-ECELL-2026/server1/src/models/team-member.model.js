import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
      enum: ["faculty", "final_year", "pre_final_year", "second_year", "alumni"],
      default: "second_year",
    },
    categoryLabel: {
      type: String,
      trim: true,
      default: "Our Team (Second Year)",
    },
    subTeam: {
      type: String,
      trim: true,
      default: "",
      maxlength: [120, "Sub-team cannot exceed 120 characters"],
      index: true,
    },
    role: {
      type: String,
      trim: true,
      default: "",
      maxlength: [120, "Role cannot exceed 120 characters"],
    },
    registrationNo: {
      type: String,
      trim: true,
      default: "",
      maxlength: [60, "Registration number cannot exceed 60 characters"],
    },
    sequence: {
      type: Number,
      default: 1,
      index: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      default: "",
      maxlength: [254, "Email cannot exceed 254 characters"],
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "LinkedIn URL cannot exceed 500 characters"],
    },
    instagram: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Instagram URL cannot exceed 500 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

teamMemberSchema.index({ category: 1, sequence: 1 });

export const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
