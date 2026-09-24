import { Schema, Types, model } from "mongoose";

const companySchema = new Schema({
  collegeinfo: { type: Types.ObjectId, ref: "college" },
  name: { type: String, required: true, trim: true },
  sector: { type: String, required: true, trim: true },
  industry: { type: String, required: true, trim: true },
  hrname: { type: String, required: true, trim: true },
  hrphno: { type: Number, required: true },
  hremail: { type: String, required: true, trim: true, lowercase: true },
  descp: { type: String, required: true, trim: true },
  logo: { type: String },
  isRecruiting: { type: Boolean, default: true },
  createdBy: { type: Types.ObjectId, ref: "user" },
}, { versionKey: false, timestamps: true });

export const companymodel = model("company", companySchema);
