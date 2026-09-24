import { Schema, Types, model } from "mongoose";

const attachmentSchema = new Schema({
  storageName: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
}, { _id: false });

const historySchema = new Schema({
  action: { type: String, required: true },
  actor: { type: Types.ObjectId, ref: "user", required: true },
  comment: { type: String, default: "" },
  at: { type: Date, default: Date.now },
}, { _id: false });

const requestSchema = new Schema({
  userinfo: { type: Types.ObjectId, ref: "user", required: true },
  catogery: {
    type: String,
    enum: ["leave", "document_request", "fee_related", "course_drop", "subject_change", "project_extension", "grievance", "other"],
    required: true,
  },
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  fromDate: { type: Date },
  toDate: { type: Date },
  attachments: { type: [attachmentSchema], default: [] },
  action: { type: String, enum: ["submitted", "reviewed", "approved", "rejected", "escalated", "commented"], default: "submitted" },
  priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal" },
  reviewComment: { type: String, default: "" },
  reviewedBy: { type: Types.ObjectId, ref: "user" },
  reviewedAt: { type: Date },
  history: { type: [historySchema], default: [] },
}, { versionKey: false, timestamps: true });

requestSchema.index({ userinfo: 1, createdAt: -1 });
requestSchema.index({ action: 1, createdAt: -1 });

export const requestmodel = model("request", requestSchema);
