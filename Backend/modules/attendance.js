import { Schema, Types, model } from "mongoose";

const attendanceSchema = new Schema({
  subjectinfo: { type: Types.ObjectId, ref: "subject", required: true },
  studentid: { type: Types.ObjectId, ref: "user", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["present", "absent", "late"], default: "absent" },
  markedBy: { type: Types.ObjectId, ref: "user", required: true },
}, { versionKey: false, timestamps: true });

attendanceSchema.index({ subjectinfo: 1, studentid: 1, date: 1 }, { unique: true });

export const attendancemodel = model("attendance", attendanceSchema);
