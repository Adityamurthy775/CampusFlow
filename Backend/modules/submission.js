import { Schema, Types, model } from "mongoose";

const attachmentSchema = new Schema({
  storageName: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
}, { _id: false });

const submissionSchema = new Schema({
  assignment: { type: Types.ObjectId, ref: "assignment", required: true },
  studentinfo: { type: Types.ObjectId, ref: "user", required: true },
  attachments: { type: [attachmentSchema], default: [] },
  marksobtained: { type: Number, min: 0, default: null },
  grade: { type: String, default: "" },
  feedback: { type: String, default: "" },
  status: { type: String, enum: ["submitted", "under_review", "graded", "returned"], default: "submitted" },
  attempt: { type: Number, min: 1, default: 1 },
  submittedAt: { type: Date, default: Date.now },
  gradedBy: { type: Types.ObjectId, ref: "user" },
  gradedAt: { type: Date },
}, { versionKey: false, timestamps: true });

submissionSchema.index({ assignment: 1, studentinfo: 1 }, { unique: true });
submissionSchema.index({ studentinfo: 1, status: 1 });

export const submissionmodel = model("submission", submissionSchema);
