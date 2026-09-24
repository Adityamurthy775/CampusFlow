import exp from "express";
import { timetabletmodel } from "../modules/timetable.js";
import { verifyToken, ALL_ROLES } from "../middleware/verifyToken.js";

export const timetableapp = exp.Router();

const roles = ALL_ROLES;

function populateTimetable(query) {
  return query
    .populate("collegeinfo", "name code")
    .populate("deptinfo", "name code")
    .populate("courseinfo", "name code")
    .populate("days.periods.subjectinfo", "code name credits year semester branch")
    .populate("days.periods.faculty", "employeeCode designation office")
    .populate("days.periods.faculty.user", "username email role")
    .populate("days.periods.roominfo", "code name type building floor capacity");
}

timetableapp.get("/current", verifyToken(...roles), async (req, res) => {
  const branch = String(req.query.branch || "CSE-DSA");
  const year = Number(req.query.year || 3);
  const semester = Number(req.query.semester || 1);
  const timetable = await populateTimetable(
    timetabletmodel.findOne({ branch, year, semester, status: "published" }),
  );
  if (!timetable) {
    return res.status(404).json({ message: "Published timetable not found" });
  }
  res.status(200).json({ message: "Timetable fetched successfully", payload: timetable });
});

timetableapp.get("/day/:day", verifyToken(...roles), async (req, res) => {
  const day = String(req.params.day);
  const branch = String(req.query.branch || "CSE-DSA");
  const year = Number(req.query.year || 3);
  const semester = Number(req.query.semester || 1);
  const timetable = await populateTimetable(
    timetabletmodel.findOne({ branch, year, semester, status: "published", "days.day": day }),
  );
  if (!timetable) return res.status(404).json({ message: "Timetable day not found" });
  res.status(200).json({
    message: "Timetable day fetched successfully",
    payload: {
      ...timetable.toObject(),
      days: timetable.days.filter((item) => item.day === day),
    },
  });
});
