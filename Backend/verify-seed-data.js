import "dotenv/config";
import mongoose from "mongoose";
import { usermodel } from "./modules/User.js";
import { subjectmodel } from "./modules/subject.js";
import { roommodel } from "./modules/room.js";
import { facultymodel } from "./modules/faculty.js";
import { timetabletmodel } from "./modules/timetable.js";
import { assignmentmodel } from "./modules/assignment.js";
import { submissionmodel } from "./modules/submission.js";
import { attendancemodel } from "./modules/attendance.js";
import { announcementmodel } from "./modules/announcement.js";
import { eventmodel } from "./modules/events.js";
import { requestmodel } from "./modules/request.js";
import { companymodel } from "./modules/company.js";
import { drivemodel } from "./modules/drive.js";

const failures = [];
const check = (label, passed, detail) => {
  if (!passed) failures.push(`${label}${detail ? `: ${detail}` : ""}`);
  return { label, passed, detail };
};

try {
  await mongoose.connect(process.env.MONGO_DIRECT_URI || process.env.MONGO_URI || "mongodb://localhost:27017/campusflow");

  const subjects = await subjectmodel.find().lean();
  const subjectById = new Map(subjects.map((subject) => [String(subject._id), subject]));
  const rooms = await roommodel.countDocuments();
  const facultyProfiles = await facultymodel.countDocuments();
  const demoUsers = await usermodel.countDocuments({ email: /@campusflow\.local$/ });
  const demoTeacher = await usermodel.findOne({ email: "teacher.demo@campusflow.local" }).lean();

  const timetable = await timetabletmodel.findOne({ branch: "CSE-DSA", year: 3, semester: 1, status: "published" }).lean();
  const periods = (timetable?.days || []).flatMap((day) => day.periods || []);
  const referencedIds = [...new Set(periods.map((period) => period.subjectinfo).filter(Boolean).map(String))];
  const unresolved = referencedIds.filter((id) => !subjectById.has(id));
  const teacherless = subjects.filter((subject) => !subject.teacherinfo).map((subject) => subject.code || subject.name);
  const teacherOwnedSubjects = demoTeacher
    ? subjects.filter((subject) => String(subject.teacherinfo) === String(demoTeacher._id) || (subject.additionalFaculty || []).some((id) => String(id) === String(demoTeacher._id))).length
    : 0;
  const timetableSubjectRows = periods.map((period) => {
    const subject = period.subjectinfo ? subjectById.get(String(period.subjectinfo)) : null;
    return {
      day: period.subjectName,
      subject: subject?.name || null,
      code: subject?.code || period.subjectCode || null,
      teacherAssigned: Boolean(subject?.teacherinfo),
    };
  });

  const checks = [
    check("demo users seeded", demoUsers >= 8, `${demoUsers} found`),
    check("subjects seeded", subjects.length >= 12, `${subjects.length} found`),
    check("rooms seeded", rooms >= 8, `${rooms} found`),
    check("faculty profiles seeded", facultyProfiles >= 8, `${facultyProfiles} found`),
    check("published timetable exists", Boolean(timetable), timetable ? "" : "no published timetable for CSE-DSA / 3 / 1"),
    check("timetable has 6 days", (timetable?.days || []).length === 6, `${(timetable?.days || []).length} days`),
    check("timetable has periods", periods.length >= 20, `${periods.length} periods`),
    check("every timetable subject resolves", unresolved.length === 0, unresolved.join(", ")),
    check("every subject has a teacher", teacherless.length === 0, teacherless.join(", ")),
    check("demo teacher owns subjects", teacherOwnedSubjects >= 12, `${teacherOwnedSubjects} subjects`),
    check("announcements seeded", (await announcementmodel.countDocuments()) >= 3),
    check("events seeded", (await eventmodel.countDocuments()) >= 3),
    check("assignments seeded", (await assignmentmodel.countDocuments()) >= 3),
    check("submissions seeded", (await submissionmodel.countDocuments()) >= 2),
    check("attendance seeded", (await attendancemodel.countDocuments()) >= 10),
    check("requests seeded", (await requestmodel.countDocuments()) >= 3),
    check("companies seeded", (await companymodel.countDocuments()) >= 2),
    check("drives seeded", (await drivemodel.countDocuments()) >= 2),
  ];

  console.log(JSON.stringify({
    database: mongoose.connection.name,
    host: mongoose.connection.host,
    checks,
    timetableSubjectRows: timetableSubjectRows.slice(0, 12),
    result: failures.length ? "failed" : "passed",
    failures,
  }, null, 2));

  if (failures.length) process.exitCode = 1;
} catch (error) {
  console.error("Data verification failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
