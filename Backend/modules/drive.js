import { Schema, Types, model } from "mongoose";

const driveschema = new Schema({
collegeinfo: {
    type: Types.ObjectId,
    ref: "college"
  },
  courseinfo: {
    type: Types.ObjectId,
    ref: "courses"
  },
  deptinfo: {
    type: Types.ObjectId,
    ref: "dept"
  },
  companyinfo: {
    type: Types.ObjectId,
    ref: "company",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ['full_time', 'internship', 'contract', 'part_time']
  },
  descp: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  location: {
    type: String,
    enum: ['virtual', 'in-office']
  },
  salary: {
    type: Number,
    required: true
  },
  eligibility: {
    minCgpa: { type: Number, default: 0 },
    maxBacklogs: { type: Number, default: 0 },
    allowedDepartments: [{ type: Schema.Types.ObjectId, ref: 'dept' }]
  },
  stages: [{
    name: {
      type: String,
      enum: ['Application', 'Aptitude Test', 'Technical Interview', 'HR Interview']
    },
    scheduledDate: Date,
    mode: { type: String, enum: ['online', 'offline', 'hybrid'] },
    venue: String,
    status: { type: String, enum: ['pending', 'ongoing', 'completed', 'cancelled'], default: 'pending' }
  }],
  applicationStart: { type: Date, required: true },
  applicationEnd: { type: Date, required: true },
  status: {
    type: String,
    enum: ['open', 'closed', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  createdBy: { type: Types.ObjectId, ref: "user" }
}, { versionKey: false, timestamps: true })


export const drivemodel = model("drive", driveschema)
