import { Schema, model } from "mongoose";

const roomSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["classroom", "laboratory", "seminar", "sports"],
      required: true
    },
    building: {
      type: String,
      trim: true
    },
    floor: {
      type: String,
      trim: true
    },
    capacity: {
      type: Number,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  { versionKey: false, timestamps: true },
);

export const roommodel = model("room", roomSchema);
