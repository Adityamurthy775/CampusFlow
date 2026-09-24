import { Schema, Types, model } from "mongoose";

const eventSchema = new Schema({
  coursesinfo: { type: Types.ObjectId, ref: "courses" },
  deptinfo: { type: Types.ObjectId, ref: "dept" },
  name: { type: String, required: true, trim: true },
  decp: { type: String, required: true, trim: true },
  catogery: {
    type: String,
    enum: ["academic", "cultural", "sports", "placement", "holiday", "exam", "seminar", "other"],
    required: true,
  },
  startdate: { type: Date, required: true },
  enddate: { type: Date, required: true },
  members: { type: Number, min: 0, default: 0 },
  logo: { type: String },
  createdBy: { type: Types.ObjectId, ref: "user", required: true },
  status: { type: String, enum: ["pending", "draft", "published", "archived"], default: "pending" },
}, { versionKey: false, timestamps: true });

eventSchema.index({ startdate: 1, status: 1 });

export const eventmodel = model("event", eventSchema);
