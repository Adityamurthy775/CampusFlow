import { Schema, Types, model } from "mongoose";

const periodSchema = new Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "lecture",
        "laboratory",
        "training",
        "placement",
        "activity",
        "open-elective",
        "break",
        "sports",
      ],
      required: true,
    },
    subjectinfo: { type: Types.ObjectId, ref: "subject" },
    subjectCode: { type: String, trim: true },
    subjectName: { type: String, required: true },
    faculty: [{ type: Types.ObjectId, ref: "faculty" }],
    roominfo: { type: Types.ObjectId, ref: "room" },
    roomCode: { type: String, trim: true },
  },
  { _id: false },
);

const daySchema = new Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      required: true,
    },
    periods: { type: [periodSchema], default: [] },
  },
  { _id: false },
);

const timetableSchema = new Schema(
  {
    collegeinfo: { type: Types.ObjectId, ref: "college", required: true },
    deptinfo: { type: Types.ObjectId, ref: "dept", required: true },
    courseinfo: { type: Types.ObjectId, ref: "courses", required: true },
    branch: { type: String, required: true, trim: true },
    year: { type: Number, enum: [1, 2, 3, 4], required: true },
    semester: { type: Number, enum: [1, 2], required: true },
    academicYear: { type: String, required: true, trim: true },
    effectiveFrom: { type: Date },
    days: { type: [daySchema], default: [] },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { versionKey: false, timestamps: true },
);

timetableSchema.index(
  { branch: 1, year: 1, semester: 1, academicYear: 1 },
  { unique: true },
);

export const timetabletmodel = model("timetable", timetableSchema);
