import { Schema, model } from "mongoose";

const facultySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },
  collegeinfo: {
    type: Schema.Types.ObjectId,
    ref: "college",
    required: true
  },
  deptinfo: {
    type: Schema.Types.ObjectId,
    ref: "dept",
    required: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  qualifications: {
    type: [String],
    default: []
  },
  specialization: {
    type: [String],
    default: []
  },
  experienceYears: {
    type: Number,
    min: 0,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  versionKey: false,
  timestamps: true
});

export const facultymodel = model("faculty", facultySchema);
