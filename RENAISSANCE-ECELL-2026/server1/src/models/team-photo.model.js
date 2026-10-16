import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  category: { type: String, enum: ["faculty", "fourth", "third", "second", "first", "other"], required: true },
  position: { type: String, default: "" },
  team: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  image_url: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const TeamPhoto = mongoose.model("TeamPhoto", schema);
