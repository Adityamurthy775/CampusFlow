import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { btech3Curriculum } from "./modules/btech3Curriculum.js";
import { collegemodel } from "./modules/college.js";
import { deptmodel } from "./modules/department.js";
import { coursesmodel } from "./modules/courses.js";
import { usermodel } from "./modules/User.js";
import { facultymodel } from "./modules/faculty.js";
import { roommodel } from "./modules/room.js";
import { subjectmodel } from "./modules/subject.js";
import { timetabletmodel } from "./modules/timetable.js";

const emailFor = (name) =>
  `${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "")}@campusflow.local`;

const subjectCode = (subject) =>
  subject.code || `CSE3-${subject.name.replace(/[^a-z0-9]+/gi, "-").toUpperCase()}`;

const periodType = (period, subject) => {
  if (period.subject === "Lunch") return "break";
  if (period.subject === "Sports") return "sports";
  if (period.subject === "Open Elective-I") return "open-elective";
  if (subject?.category === "Laboratory") return "laboratory";
  if (subject?.category === "Training") return "training";
  if (["Activity", "Activities", "Clubs"].includes(subject?.category)) return "activity";
  if (subject?.category === "Placement") return "placement";
  return "lecture";
};

try {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/campusflow",
  );
  const password = await bcrypt.hash("CampusFlow@2026", 12);
  const facultyNames = [
    ...new Set(
      btech3Curriculum.subjects.flatMap((subject) => subject.faculty),
    ),
  ];

  let hod = await usermodel.findOne({ email: "hod.demo@campusflow.local" });
  if (!hod) {
    hod = await usermodel.create({
      role: "hod",
      username: "Demo HOD",
      email: "hod.demo@campusflow.local",
      id: "CF-DEMO-HOD",
      studentid: "CF-DEMO-HOD",
      password,
      phno: 9000000002,
      department: btech3Curriculum.department,
      branch: btech3Curriculum.branch,
      isActive: true,
    });
  }

  const college = await collegemodel.findOneAndUpdate(
    { code: "CF" },
    {
      $setOnInsert: {
        name: "CampusFlow University",
        address: "CampusFlow University Campus",
        contact: {
          phone: "+91 90000 00000",
          email: "academic@campusflow.local",
        },
        desp: "Academic administration for CampusFlow",
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );

  const department = await deptmodel.findOneAndUpdate(
    { code: "DS" },
    {
      $set: {
        collegeinfo: college._id,
        name: btech3Curriculum.department,
        hodid: hod._id,
        descp: "Department of Data Science",
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );

  const course = await coursesmodel.findOneAndUpdate(
    { code: "BTECH-DSA" },
    {
      $set: {
        collegeinfo: college._id,
        deptinfo: department._id,
        name: btech3Curriculum.title,
        duration: "4 years",
        credits: 240,
        descp: "B.Tech Data Science undergraduate programme",
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );

  const facultyByName = new Map();
  const facultyUserByName = new Map();
  for (const [index, name] of facultyNames.entries()) {
    const employeeCode = `FAC-${String(index + 1).padStart(3, "0")}`;
    const email = emailFor(name);
    const user = await usermodel.findOneAndUpdate(
      { email },
      {
        $set: {
          role: "teacher",
          username: name,
          id: employeeCode,
          studentid: employeeCode,
          password,
          phno: 9100000000 + index,
          department: btech3Curriculum.department,
          branch: btech3Curriculum.branch,
          isActive: true,
        },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    const specialization = btech3Curriculum.subjects
      .filter((subject) => subject.faculty.includes(name))
      .map((subject) => subject.name);
    const office = btech3Curriculum.subjects.find(
      (subject) => subject.faculty.includes(name) && subject.room,
    )?.room;
    const faculty = await facultymodel.findOneAndUpdate(
      { user: user._id },
      {
        $set: {
          collegeinfo: college._id,
          deptinfo: department._id,
          designation: "Faculty",
          qualifications: [],
          specialization,
          experienceYears: 0,
          employeeCode,
          office,
          officeHours: "By department schedule",
          isActive: true,
        },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    facultyByName.set(name, faculty);
    facultyUserByName.set(name, user);
  }

  const roomCodes = [
    ...new Set(
      btech3Curriculum.subjects
        .map((subject) => subject.room)
        .concat(
          btech3Curriculum.weeklySchedule.flatMap((day) =>
            day.periods.map((period) => period.room),
          ),
        )
        .filter(Boolean),
    ),
  ];
  const roomByCode = new Map();
  for (const code of roomCodes) {
    const room = await roommodel.findOneAndUpdate(
      { code },
      {
        $set: {
          name: `Room ${code}`,
          type: code.startsWith("H-") ? "laboratory" : "classroom",
          building: code.split("-")[0],
          floor: code.split("-")[1],
          isActive: true,
        },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    roomByCode.set(code, room);
  }

  const demoTeacher = await usermodel.findOne({ email: "teacher.demo@campusflow.local" });
  const subjectByName = new Map();
  for (const subject of btech3Curriculum.subjects) {
    const facultyUsers = subject.faculty
      .map((name) => facultyUserByName.get(name))
      .filter(Boolean);
    const code = subjectCode(subject);
    const savedSubject = await subjectmodel.findOneAndUpdate(
      {
        courseinfo: course._id,
        branch: btech3Curriculum.branch,
        year: btech3Curriculum.year,
        semester: btech3Curriculum.semester,
        code,
      },
      {
        $set: {
          collegeinfo: college._id,
          deptinfo: department._id,
          courseinfo: course._id,
          teacherinfo: facultyUsers[0]._id,
          additionalFaculty: [...facultyUsers.slice(1).map((user) => user._id), ...(demoTeacher ? [demoTeacher._id] : [])],
          name: subject.name,
          code,
          descp: `${subject.name} for B.Tech Year ${btech3Curriculum.year}`,
          credits: subject.credits,
          year: btech3Curriculum.year,
          semester: btech3Curriculum.semester,
          branch: btech3Curriculum.branch,
        },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    subjectByName.set(subject.name, savedSubject);
  }

  const days = btech3Curriculum.weeklySchedule.map((day) => ({
    day: day.day,
    periods: day.periods.map((period) => {
      const [start, end] = period.time.split("-");
      const curriculumSubject = btech3Curriculum.subjects.find(
        (subject) => subject.name === period.subject,
      );
      const roomCode = period.room || curriculumSubject?.room;
      return {
        start,
        end,
        type: periodType(period, curriculumSubject),
        subjectinfo: subjectByName.get(period.subject)?._id,
        subjectCode: period.code || subjectByName.get(period.subject)?.code,
        subjectName: period.subject,
        faculty: (curriculumSubject?.faculty || [])
          .map((name) => facultyByName.get(name)?._id)
          .filter(Boolean),
        roominfo: roomByCode.get(roomCode)?._id,
        roomCode,
      };
    }),
  }));

  await timetabletmodel.findOneAndUpdate(
    {
      branch: btech3Curriculum.branch,
      year: btech3Curriculum.year,
      semester: btech3Curriculum.semester,
      academicYear: btech3Curriculum.academicYear,
    },
    {
      $set: {
        collegeinfo: college._id,
        deptinfo: department._id,
        courseinfo: course._id,
        effectiveFrom: new Date(`${btech3Curriculum.effectiveFrom}T00:00:00Z`),
        days,
        status: "published",
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );

  console.log(
    JSON.stringify({
      message: "B.Tech III academic data seeded",
      faculty: facultyByName.size,
      rooms: roomByCode.size,
      subjects: subjectByName.size,
      days: days.length,
      periods: days.reduce((total, day) => total + day.periods.length, 0),
    }),
  );
} catch (error) {
  console.error("Academic data seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
