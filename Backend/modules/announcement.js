import { Schema, Types, model } from "mongoose";

const announcementSchema = new Schema({
  coursesinfo: { type: Types.ObjectId, ref: "courses" },
  deptinfo: { type: Types.ObjectId, ref: "dept" },
  name: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal" },
  postedby: { type: Types.ObjectId, ref: "user", required: true },
  ispinned: { type: Boolean, default: false },
}, { versionKey: false, timestamps: true });

announcementSchema.index({ createdAt: -1, ispinned: -1 });

export const announcementmodel = model("announcement", announcementSchema);
