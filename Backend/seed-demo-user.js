import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { usermodel } from "./modules/User.js";

const accounts = [
  {
    role: "admin",
    username: "Demo Admin",
    email: "admin.demo@campusflow.local",
    id: "CF-DEMO-ADMIN",
    password: "CampusFlow@2026",
    phno: 9000000004,
    department: "CampusFlow Administration",
  },
  {
    role: "student",
    username: "Demo Student",
    email: "student.demo@campusflow.local",
    id: "CF-DEMO-3Y-DSA",
    password: "CampusFlow@2026",
    phno: 9000000000,
    department: "Data Science",
    branch: "CSE-DSA",
    year: 3,
    semester: 1,
  },
  {
    role: "teacher",
    username: "Demo Teacher",
    email: "teacher.demo@campusflow.local",
    id: "CF-DEMO-TEACHER",
    password: "CampusFlow@2026",
    phno: 9000000001,
    department: "Data Science",
    branch: "CSE-DSA",
  },
  {
    role: "hod",
    username: "Demo HOD",
    email: "hod.demo@campusflow.local",
    id: "CF-DEMO-HOD",
    password: "CampusFlow@2026",
    phno: 9000000002,
    department: "Data Science",
    branch: "CSE-DSA",
  },
  {
    role: "placement-office",
    username: "Demo Placement Office",
    email: "placement.demo@campusflow.local",
    id: "CF-DEMO-PLACEMENT",
    password: "CampusFlow@2026",
    phno: 9000000003,
    department: "Placement Cell",
    branch: "CSE-DSA",
  },
].map((account) => ({ ...account, studentid: account.id, isActive: true }));

try {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/campusflow",
  );
  const password = await bcrypt.hash("CampusFlow@2026", 12);
  for (const account of accounts) {
    await usermodel.updateOne(
      { email: account.email },
      { $set: { ...account, password } },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
  }
  console.log(
    JSON.stringify(
      {
        message: "Demo accounts ready",
        accounts: accounts.map(({ role, email, id }) => ({
          role,
          email,
          password: "CampusFlow@2026",
          campusId: id,
        })),
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error("Demo account seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
