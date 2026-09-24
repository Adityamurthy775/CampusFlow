import { Schema, Types, model } from "mongoose";

const attachmentSchema = new Schema({
  storageName: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
}, { _id: false });

const assignmentSchema = new Schema({
  subjectinfo: { type: Types.ObjectId, ref: "subject", required: true },
  teacherinfo: { type: Types.ObjectId, ref: "user", required: true },
  name: { type: String, required: true, trim: true },
  descp: { type: String, required: true, trim: true },
  instructions: { type: String, default: "", trim: true },
  maxmarks: { type: Number, required: true, min: 1, default: 100 },
  duedate: { type: Date, required: true },
  branch: { type: String, trim: true },
  year: { type: Number, min: 1, max: 4 },
  semester: { type: Number, min: 1, max: 2 },
  status: { type: String, enum: ["draft", "published", "closed"], default: "published" },
  attachments: { type: [attachmentSchema], default: [] },
  submissions: [{ type: Types.ObjectId, ref: "submission" }],
}, { versionKey: false, timestamps: true });

assignmentSchema.index({ subjectinfo: 1, duedate: -1 });

export const assignmentmodel = model("assignment", assignmentSchema);
