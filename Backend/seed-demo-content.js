import "dotenv/config";
import mongoose from "mongoose";
import { usermodel } from "./modules/User.js";
import { subjectmodel } from "./modules/subject.js";
import { assignmentmodel } from "./modules/assignment.js";
import { submissionmodel } from "./modules/submission.js";
import { attendancemodel } from "./modules/attendance.js";
import { announcementmodel } from "./modules/announcement.js";
import { eventmodel } from "./modules/events.js";
import { requestmodel } from "./modules/request.js";
import { companymodel } from "./modules/company.js";
import { drivemodel } from "./modules/drive.js";
import { collegemodel } from "./modules/college.js";
import { deptmodel } from "./modules/department.js";
import { coursesmodel } from "./modules/courses.js";

const day = (offset) => {
  const value = new Date();
  value.setHours(12, 0, 0, 0);
  value.setDate(value.getDate() + offset);
  return value;
};

try {
  await mongoose.connect(process.env.MONGO_DIRECT_URI || process.env.MONGO_URI || "mongodb://localhost:27017/campusflow");

  const emails = {
    admin: "admin.demo@campusflow.local",
    student: "student.demo@campusflow.local",
    student2: "student2.demo@campusflow.local",
    student3: "student3.demo@campusflow.local",
    student4: "student4.demo@campusflow.local",
    teacher: "teacher.demo@campusflow.local",
    hod: "hod.demo@campusflow.local",
    placement: "placement.demo@campusflow.local",
  };
  const users = {};
  for (const [key, email] of Object.entries(emails)) {
    users[key] = await usermodel.findOne({ email });
    if (!users[key]) throw new Error(`Missing demo user ${email}. Run npm run seed:demo first.`);
  }
  const students = [users.student, users.student2, users.student3, users.student4];
  const staff = [users.admin, users.teacher, users.hod, users.placement];

  const subjects = await subjectmodel.find({ branch: "CSE-DSA", year: 3, semester: 1 }).sort({ code: 1 });
  if (subjects.length < 3) throw new Error("Missing academic subjects. Run npm run seed:academic first.");
  const [subjectA, subjectB, subjectC] = subjects;

  const college = await collegemodel.findOne({ code: "CF" });
  const department = await deptmodel.findOne({ code: "DS" });
  const course = await coursesmodel.findOne({ code: "BTECH-DSA" });

  await Promise.all([
    announcementmodel.deleteMany({ postedby: { $in: staff.map((user) => user._id) } }),
    eventmodel.deleteMany({ createdBy: { $in: staff.map((user) => user._id) } }),
    assignmentmodel.deleteMany({ teacherinfo: users.teacher._id }),
    submissionmodel.deleteMany({ studentinfo: { $in: students.map((user) => user._id) } }),
    attendancemodel.deleteMany({ markedBy: { $in: staff.map((user) => user._id) } }),
    requestmodel.deleteMany({ userinfo: { $in: [...staff, ...students].map((user) => user._id) } }),
    companymodel.deleteMany({ createdBy: { $in: staff.map((user) => user._id) } }),
    drivemodel.deleteMany({ createdBy: { $in: staff.map((user) => user._id) } }),
  ]);

  const announcements = await announcementmodel.create([
    { name: "Mid-semester exam schedule published", content: "The B.Tech Data Science mid-semester timetable is now live in the Schedule workspace. Exams begin Monday.", priority: "high", postedby: users.hod._id, deptinfo: department?._id, coursesinfo: course?._id, ispinned: true },
    { name: "Library maintenance window", content: "The central library catalogue will be unavailable on Sunday between 2:00 AM and 4:00 AM for scheduled maintenance.", priority: "normal", postedby: users.admin._id },
    { name: "Placement drive: Amazon SDE", content: "Third-year Data Science students can register for the Amazon SDE drive from the Placement workspace until Friday.", priority: "urgent", postedby: users.placement._id },
    { name: "Data Structures lab revision", content: "Extra revision sessions for sorting algorithms and graph traversal run every Saturday in Room H-201.", priority: "low", postedby: users.teacher._id, coursesinfo: subjectA.courseinfo },
  ]);

  const events = await eventmodel.create([
    { name: "Annual Tech Expo 2026", decp: "Two-day exhibition with project showcases, industry talks, and hiring stalls.", catogery: "placement", startdate: day(9), enddate: day(10), members: 500, createdBy: users.placement._id, status: "published", deptinfo: department?._id, coursesinfo: course?._id },
    { name: "Inter-college Sports Day", decp: "Athletics, cricket, football, and basketball finals across all departments.", catogery: "sports", startdate: day(16), enddate: day(17), members: 320, createdBy: users.hod._id, status: "published" },
    { name: "Mid-semester Examinations", decp: "Third-year semester one examinations across all subjects.", catogery: "exam", startdate: day(23), enddate: day(28), members: 640, createdBy: users.hod._id, status: "published" },
    { name: "Student Hackathon", decp: "Forty-eight hour build sprint with mentor tracks and cash prizes.", catogery: "academic", startdate: day(30), enddate: day(31), members: 180, createdBy: users.teacher._id, status: "pending" },
  ]);

  const assignments = await assignmentmodel.create([
    { subjectinfo: subjectA._id, teacherinfo: users.teacher._id, name: "Linked List Lab Report", descp: "Implement a doubly linked list with insert, delete, and search operations, then document complexity analysis.", instructions: "Submit a single PDF with code screenshots and analysis. Maximum ten pages.", maxmarks: 20, duedate: day(3), branch: "CSE-DSA", year: 3, semester: 1, status: "published" },
    { subjectinfo: subjectB._id, teacherinfo: users.teacher._id, name: "Database Query Optimisation", descp: "Write and benchmark five SQL queries, then explain the effect of indexing on execution plans.", instructions: "Include EXPLAIN output for each query before and after indexing.", maxmarks: 25, duedate: day(6), branch: "CSE-DSA", year: 3, semester: 1, status: "published" },
    { subjectinfo: subjectC._id, teacherinfo: users.teacher._id, name: "Machine Learning Pipeline", descp: "Build an end-to-end pipeline for a classification dataset with cross-validation and a short report.", instructions: "Submit notebook and report together as one archive.", maxmarks: 30, duedate: day(-2), branch: "CSE-DSA", year: 3, semester: 1, status: "published" },
  ]);

  const submissions = await submissionmodel.create([
    { assignment: assignments[0]._id, studentinfo: users.student._id, status: "submitted", submittedAt: day(-1) },
    { assignment: assignments[0]._id, studentinfo: users.student2._id, status: "graded", marksobtained: 18, grade: "A", feedback: "Strong implementation. Improve the delete operation documentation.", gradedBy: users.teacher._id, gradedAt: day(-1), submittedAt: day(-2) },
    { assignment: assignments[2]._id, studentinfo: users.student._id, status: "graded", marksobtained: 26, grade: "B+", feedback: "Good preprocessing, but validation strategy needs a larger test split.", gradedBy: users.teacher._id, gradedAt: day(-1), submittedAt: day(-4) },
  ]);
  await assignmentmodel.updateOne({ _id: assignments[0]._id }, { $addToSet: { submissions: { $each: [submissions[0]._id, submissions[1]._id] } } });
  await assignmentmodel.updateOne({ _id: assignments[2]._id }, { $addToSet: { submissions: submissions[2]._id } });

  const attendanceSubjects = [subjectA, subjectB];
  const attendance = [];
  for (let offset = -4; offset <= 0; offset += 1) {
    attendanceSubjects.forEach((subject, subjectIndex) => {
      students.forEach((student, studentIndex) => {
        const status = (offset + subjectIndex + studentIndex) % 7 === 0 ? "absent" : (offset + studentIndex) % 5 === 0 ? "late" : "present";
        attendance.push({ subjectinfo: subject._id, studentid: student._id, date: day(offset), status, markedBy: users.teacher._id });
      });
    });
  }
  await attendancemodel.insertMany(attendance);

  const requests = await requestmodel.create([
    { userinfo: users.student._id, catogery: "leave", title: "Medical leave", subject: "Recovering from a viral fever and advised rest by the campus health centre.", fromDate: day(4), toDate: day(5), priority: "high", attachments: [], action: "submitted", history: [{ action: "submitted", actor: users.student._id, comment: "" }] },
    { userinfo: users.teacher._id, catogery: "course_drop", title: "Course drop request", subject: "Requesting to drop the elective due to a clash with a research internship deadline.", priority: "normal", attachments: [], action: "submitted", history: [{ action: "submitted", actor: users.teacher._id, comment: "" }] },
    { userinfo: users.placement._id, catogery: "document_request", title: "Transcript request", subject: "Three sealed transcript copies needed for the placement drive verification desk.", priority: "normal", attachments: [], action: "submitted", history: [{ action: "submitted", actor: users.placement._id, comment: "" }] },
    { userinfo: users.student2._id, catogery: "leave", title: "Family function", subject: "Traveling home for a family function, returning before the next working day.", fromDate: day(-6), toDate: day(-5), priority: "normal", attachments: [], action: "approved", reviewComment: "Approved. Please submit the leave note to the class coordinator.", reviewedBy: users.hod._id, reviewedAt: day(-7), history: [{ action: "submitted", actor: users.student2._id, comment: "" }, { action: "approved", actor: users.hod._id, comment: "Approved." }] },
  ]);

  const companies = await companymodel.create([
    { name: "Amazon", sector: "Technology", industry: "Cloud and E-Commerce", hrname: "Aditi Rao", hrphno: 9000000101, hremail: "hr.amazon@demo.campusflow.local", descp: "SDE and data engineering roles for third-year students.", isRecruiting: true, createdBy: users.placement._id, collegeinfo: college?._id },
    { name: "Atlassian", sector: "Technology", industry: "Developer Tools", hrname: "Rohit Menon", hrphno: 9000000102, hremail: "hr.atlassian@demo.campusflow.local", descp: "Product and platform engineering internships.", isRecruiting: true, createdBy: users.placement._id, collegeinfo: college?._id },
    { name: "TCS Digital", sector: "Information Technology", industry: "Consulting", hrname: "Neha Kulkarni", hrphno: 9000000103, hremail: "hr.tcs@demo.campusflow.local", descp: "Digital engineering and analytics roles.", isRecruiting: false, createdBy: users.placement._id, collegeinfo: college?._id },
  ]);

  const drives = await drivemodel.create([
    { companyinfo: companies[0]._id, name: "Amazon SDE Drive", descp: "Online assessment followed by two technical interviews and a virtual HR round.", role: "Software Development Engineer", jobType: "full_time", location: "virtual", salary: 28.5, eligibility: { minCgpa: 7, maxBacklogs: 0, allowedDepartments: department ? [department._id] : [] }, stages: [{ name: "Application", mode: "online", status: "pending" }, { name: "Aptitude Test", mode: "online", status: "pending" }, { name: "Technical Interview", mode: "online", status: "pending" }, { name: "HR Interview", mode: "online", status: "pending" }], applicationStart: day(-5), applicationEnd: day(12), status: "open", createdBy: users.placement._id, collegeinfo: college?._id, courseinfo: course?._id, deptinfo: department?._id },
    { companyinfo: companies[1]._id, name: "Atlassian Internship", descp: "Summer internship for third-year students with a minimum CGPA of 7.5.", role: "Software Engineering Intern", jobType: "internship", location: "in-office", salary: 12, eligibility: { minCgpa: 7.5, maxBacklogs: 1, allowedDepartments: department ? [department._id] : [] }, stages: [{ name: "Application", mode: "online", status: "pending" }, { name: "Technical Interview", mode: "online", status: "pending" }], applicationStart: day(-12), applicationEnd: day(-2), status: "closed", createdBy: users.placement._id, collegeinfo: college?._id, courseinfo: course?._id, deptinfo: department?._id },
  ]);

  console.log(JSON.stringify({
    message: "Demo content seeded",
    announcements: announcements.length,
    events: events.length,
    assignments: assignments.length,
    submissions: submissions.length,
    attendance: attendance.length,
    requests: requests.length,
    companies: companies.length,
    drives: drives.length,
  }, null, 2));
} catch (error) {
  console.error("Demo content seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
