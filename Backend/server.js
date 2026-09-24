import "dotenv/config";
import exp from 'express'
import cookieParser from 'cookie-parser';
import { connect } from "mongoose";
import { userapp } from './Apis/userapi.js';
import { studentapp } from './Apis/studentapi.js';
import { facultyapp } from './Apis/faculty.js';
import { collegeapp } from './Apis/college.js';
import { deptapp } from './Apis/dept.js';
import { courseapp } from './Apis/courses.js';
import { subjectapp } from './Apis/subject.js';
import { assignmentapp } from './Apis/assignment.js';
import { submissionapp } from './Apis/submission.js';
import { attendanceapp } from './Apis/attendance.js';
import { announcementapp } from './Apis/announcements.js';
import { eventapp } from './Apis/events.js';
import { companyapp } from './Apis/company.js';
import { driveapp } from './Apis/drive.js';
import { requestapp } from './Apis/request.js';
import { roomapp } from './Apis/room.js';
import { timetableapp } from './Apis/timetable.js';
import { rateLimit } from './middleware/rateLimiter.js';

let app = exp();
let port = Number(process.env.PORT) || 4000;
let databaseReady = false;
let databaseError = null;

// Middleware: Parse cookies (required for verifyToken to read req.cookies.token)
app.use(cookieParser());

// Middleware: Convert JSON body to JS object
app.use(exp.json());

// Middleware: CORS headers (reflect origin to support cookie credentials)
const allowedOrigins = new Set((process.env.CLIENT_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173").split(",").map((origin) => origin.trim()));
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.has(origin)) {
    return res.status(403).json({ message: "Origin is not allowed" });
  }
  if (origin) res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Middleware: Rate limiting (300 requests per minute per IP)
app.use(rateLimit);

// Keep the HTTP service available while Atlas is reconnecting, but fail data
// requests quickly with a useful readiness response instead of hanging them.
app.use((req, res, next) => {
  if (req.path === "/" || req.path === "/health" || req.method === "OPTIONS") return next();
  if (!databaseReady) {
    return res.status(503).json({
      message: "CampusFlow database is not ready",
      code: "DATABASE_UNAVAILABLE",
      detail: databaseError || "The server is still connecting to MongoDB.",
    });
  }
  next();
});

// API route mounting
app.use("/user-api", userapp);
app.use("/student-api", studentapp);
app.use("/faculty-api", facultyapp);
app.use("/college-api", collegeapp);
app.use("/dept-api", deptapp);
app.use("/course-api", courseapp);
app.use("/subject-api", subjectapp);
app.use("/room-api", roomapp);
app.use("/timetable-api", timetableapp);
app.use("/assignment-api", assignmentapp);
app.use("/submission-api", submissionapp);
app.use("/attendance-api", attendanceapp);
app.use("/announcement-api", announcementapp);
app.use("/event-api", eventapp);
app.use("/company-api", companyapp);
app.use("/drive-api", driveapp);
app.use("/request-api", requestapp);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "CampusFlow API is running", version: "1.0.0" });
});

app.get("/health", (req, res) => {
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "ok" : "degraded",
    database: databaseReady ? "connected" : "disconnected",
    ...(databaseError ? { detail: databaseError } : {}),
  });
});

// Connection to the database
async function connection() {
  try {
    // Atlas SRV DNS can be blocked by some hosting DNS resolvers. Prefer the
    // optional direct replica-set URI when supplied, while keeping MONGO_URI
    // as the normal/default configuration.
    const mongoUri = process.env.MONGO_DIRECT_URI || process.env.MONGO_URI || "mongodb://localhost:27017/campusflow";
    await connect(mongoUri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
    databaseReady = true;
    databaseError = null;
    console.log("Connection to MongoDB is successful");
  } catch (error) {
    databaseReady = false;
    databaseError = error.message;
    console.error("Error connecting to the Database:", error.message);
    setTimeout(connection, 10000);
  }
}

// Start HTTP immediately so the frontend can distinguish a live API from a
// database outage, then keep trying to establish the cluster connection.
app.listen(port, () => console.log(`CampusFlow server is running on port ${port}`));
connection();

// Handle invalid path (404 for unmatched routes)
app.use((req, res) => {
  res.status(404).json({ message: `Invalid path: ${req.method} ${req.originalUrl}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: "Validation error", error: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: "Invalid ID format", error: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate key error", error: err.message });
  }
  // Server-side error
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

