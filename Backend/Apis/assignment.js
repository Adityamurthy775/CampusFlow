import exp from "express";
import { assignmentmodel } from "../modules/assignment.js";
import { subjectmodel } from "../modules/subject.js";
import { verifyToken, ALL_ROLES } from "../middleware/verifyToken.js";
import { upload, fileMeta, storedFilePath, removeStoredFiles } from "../middleware/upload.js";

export const assignmentapp = exp.Router();

function populateAssignments(query) {
  return query
    .populate("subjectinfo", "name code credits year semester branch")
    .populate("teacherinfo", "username email role");
}

async function ownsAssignment(assignment, req) {
  return ["admin", "hod"].includes(req.role) || assignment.teacherinfo?.toString() === req.userId;
}

assignmentapp.post("/create", verifyToken("admin", "teacher", "hod"), upload.single("file"), async (req, res) => {
  const { name, descp, instructions, maxmarks, duedate, subjectinfo, status, branch, year, semester } = req.body;
  if (!name || !descp || !duedate || !subjectinfo || !req.file) {
    removeStoredFiles(req.file ? [fileMeta(req.file)] : []);
    return res.status(400).json({ message: "Name, description, due date, subject, and assignment file are required" });
  }
  const subject = await subjectmodel.findById(subjectinfo);
  if (!subject) {
    removeStoredFiles([fileMeta(req.file)]);
    return res.status(404).json({ message: "Subject not found" });
  }
  const facultyIds = [subject.teacherinfo?.toString(), ...(subject.additionalFaculty || []).map((id) => id.toString())];
  if (req.role === "teacher" && !facultyIds.includes(req.userId)) {
    removeStoredFiles([fileMeta(req.file)]);
    return res.status(403).json({ message: "You can only create assignments for your subjects" });
  }
  const assignment = await assignmentmodel.create({
    name,
    descp,
    instructions: instructions || "",
    maxmarks: Number(maxmarks) || 100,
    duedate,
    subjectinfo,
    teacherinfo: req.userId,
    branch: branch || subject.branch,
    year: Number(year) || subject.year,
    semester: Number(semester) || subject.semester,
    status: ["draft", "published", "closed"].includes(status) ? status : "published",
    attachments: [fileMeta(req.file)],
  });
  res.status(201).json({ message: "Assignment created successfully", payload: await populateAssignments(assignmentmodel.findById(assignment._id)) });
});

assignmentapp.get("/all", verifyToken(...ALL_ROLES), async (req, res) => {
  const filter = {};
  if (req.role === "teacher") filter.teacherinfo = req.userId;
  if (req.role === "student") {
    const subjects = await subjectmodel.find({
      branch: req.query.branch || "CSE-DSA",
      year: Number(req.query.year) || 3,
      semester: Number(req.query.semester) || 1,
    }).select("_id");
    filter.subjectinfo = { $in: subjects.map((subject) => subject._id) };
  }
  const assignments = await populateAssignments(assignmentmodel.find(filter).sort({ duedate: 1 }));
  res.status(200).json({ message: "Assignments fetched successfully", payload: assignments });
});

assignmentapp.get("/info/:id", verifyToken(...ALL_ROLES), async (req, res) => {
  const assignment = await assignmentmodel.findById(req.params.id)
    .populate("subjectinfo", "name code credits year semester branch")
    .populate("teacherinfo", "username email role")
    .populate({ path: "submissions", select: "studentinfo status marksobtained grade submittedAt", populate: { path: "studentinfo", select: "username email" } });
  if (!assignment) return res.status(404).json({ message: "Assignment not found" });
  res.status(200).json({ message: "Assignment fetched successfully", payload: assignment });
});

assignmentapp.get("/download/:id/:index", verifyToken(...ALL_ROLES), async (req, res) => {
  const assignment = await assignmentmodel.findById(req.params.id);
  const file = assignment?.attachments?.[Number(req.params.index)];
  if (!assignment || !file) return res.status(404).json({ message: "Assignment file not found" });
  res.download(storedFilePath(file.storageName), file.originalName);
});

assignmentapp.patch("/update/:id", verifyToken("admin", "teacher", "hod"), async (req, res) => {
  const assignment = await assignmentmodel.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: "Assignment not found" });
  if (!await ownsAssignment(assignment, req)) return res.status(403).json({ message: "You cannot update this assignment" });
  const fields = ["name", "descp", "instructions", "maxmarks", "duedate", "status"];
  const updates = Object.fromEntries(fields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));
  if (!Object.keys(updates).length) return res.status(400).json({ message: "No editable assignment fields were provided" });
  const updated = await assignmentmodel.findByIdAndUpdate(assignment._id, { $set: updates }, { returnDocument: "after", runValidators: true });
  res.status(200).json({ message: "Assignment updated successfully", payload: await populateAssignments(assignmentmodel.findById(updated._id)) });
});

assignmentapp.delete("/delete/:id", verifyToken("admin", "teacher", "hod"), async (req, res) => {
  const assignment = await assignmentmodel.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: "Assignment not found" });
  if (!await ownsAssignment(assignment, req)) return res.status(403).json({ message: "You cannot delete this assignment" });
  if (assignment.submissions.length) return res.status(409).json({ message: "Assignments with submissions cannot be deleted" });
  removeStoredFiles(assignment.attachments);
  await assignmentmodel.findByIdAndDelete(assignment._id);
  res.status(200).json({ message: "Assignment deleted successfully" });
});
