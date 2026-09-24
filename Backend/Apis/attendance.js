import exp from "express";
import { attendancemodel } from "../modules/attendance.js";
import { subjectmodel } from "../modules/subject.js";
import { usermodel } from "../modules/User.js";
import { verifyToken, ALL_ROLES } from "../middleware/verifyToken.js";

export const attendanceapp = exp.Router();

async function teachesSubject(subjectId, userId) {
  const subject = await subjectmodel.findById(subjectId).select("teacherinfo additionalFaculty");
  return subject && [subject.teacherinfo?.toString(), ...(subject.additionalFaculty || []).map((id) => id.toString())].includes(userId);
}

function populateAttendance(query) {
  return query
    .populate("studentid", "username email id branch year semester")
    .populate("subjectinfo", "name code")
    .populate("markedBy", "username email role");
}

async function canManage(subjectId, req) {
  return ["admin", "hod"].includes(req.role) || await teachesSubject(subjectId, req.userId);
}

attendanceapp.post("/mark", verifyToken("admin", "teacher", "hod"), async (req, res) => {
  const { subjectinfo, date, records } = req.body;
  if (!subjectinfo || !date || !Array.isArray(records) || !records.length) {
    return res.status(400).json({ message: "Subject, date, and attendance records are required" });
  }
  if (!await canManage(subjectinfo, req)) return res.status(403).json({ message: "You cannot mark attendance for this subject" });
  const studentIds = records.map((record) => record.studentid);
  const studentCount = await usermodel.countDocuments({ _id: { $in: studentIds }, role: "student" });
  if (studentCount !== new Set(studentIds).size) return res.status(400).json({ message: "Every attendance record must reference a valid student" });
  const operations = records.map((record) => ({
    updateOne: {
      filter: { subjectinfo, studentid: record.studentid, date: new Date(date) },
      update: { $set: { status: record.status, markedBy: req.userId } },
      upsert: true,
    },
  }));
  await attendancemodel.bulkWrite(operations);
  const attendance = await populateAttendance(attendancemodel.find({ subjectinfo, date: new Date(date) }));
  res.status(201).json({ message: "Attendance saved successfully", payload: attendance });
});

attendanceapp.get("/all", verifyToken(...ALL_ROLES), async (req, res) => {
  const filter = {};
  if (req.role === "student") filter.studentid = req.userId;
  if (req.role === "teacher") {
    const subjects = await subjectmodel.find({ $or: [{ teacherinfo: req.userId }, { additionalFaculty: req.userId }] }).select("_id");
    filter.subjectinfo = { $in: subjects.map((subject) => subject._id) };
  }
  if (req.role === "placement-office") {
    res.status(200).json({ message: "Attendance records fetched successfully", payload: [] });
    return;
  }
  const records = await populateAttendance(attendancemodel.find(filter).sort({ date: -1 }));
  res.status(200).json({ message: "Attendance records fetched successfully", payload: records });
});

attendanceapp.get("/info/:id", verifyToken(...ALL_ROLES), async (req, res) => {
  const record = await attendancemodel.findById(req.params.id);
  if (!record) return res.status(404).json({ message: "Attendance record not found" });
  const allowed = req.role === "student"
    ? record.studentid?.toString() === req.userId
    : await canManage(record.subjectinfo, req);
  if (!allowed && !["admin", "hod"].includes(req.role)) return res.status(403).json({ message: "You cannot access this attendance record" });
  res.status(200).json({ message: "Attendance record fetched successfully", payload: await populateAttendance(attendancemodel.findById(record._id)) });
});

attendanceapp.patch("/update/:id", verifyToken("admin", "teacher", "hod"), async (req, res) => {
  const record = await attendancemodel.findById(req.params.id);
  if (!record) return res.status(404).json({ message: "Attendance record not found" });
  if (!await canManage(record.subjectinfo, req)) return res.status(403).json({ message: "You cannot update this attendance record" });
  if (!["present", "absent", "late"].includes(req.body.status)) return res.status(400).json({ message: "A valid attendance status is required" });
  const updated = await attendancemodel.findByIdAndUpdate(record._id, { $set: { status: req.body.status, markedBy: req.userId } }, { returnDocument: "after", runValidators: true });
  res.status(200).json({ message: "Attendance updated successfully", payload: updated });
});

attendanceapp.delete("/delete/:id", verifyToken("admin", "teacher", "hod"), async (req, res) => {
  const record = await attendancemodel.findById(req.params.id);
  if (!record) return res.status(404).json({ message: "Attendance record not found" });
  if (!await canManage(record.subjectinfo, req)) return res.status(403).json({ message: "You cannot delete this attendance record" });
  await attendancemodel.findByIdAndDelete(record._id);
  res.status(200).json({ message: "Attendance record deleted successfully" });
});
