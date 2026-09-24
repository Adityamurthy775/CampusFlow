import exp from "express";
import { submissionmodel } from "../modules/submission.js";
import { assignmentmodel } from "../modules/assignment.js";
import { subjectmodel } from "../modules/subject.js";
import { verifyToken, ALL_ROLES } from "../middleware/verifyToken.js";
import { upload, fileMeta, storedFilePath, removeStoredFiles } from "../middleware/upload.js";

export const submissionapp = exp.Router();

function populateSubmissions(query) {
  return query
    .populate("studentinfo", "username email id role")
    .populate("assignment", "name duedate maxmarks subjectinfo teacherinfo status")
    .populate("gradedBy", "username email role");
}

async function canReview(assignment, req) {
  if (["admin", "hod"].includes(req.role)) return true;
  if (req.role !== "teacher" || !assignment) return false;
  const subject = await subjectmodel.findById(assignment.subjectinfo).select("teacherinfo additionalFaculty");
  return subject && [subject.teacherinfo?.toString(), ...(subject.additionalFaculty || []).map((id) => id.toString())].includes(req.userId);
}

async function canAccess(submission, req) {
  if (["admin", "hod"].includes(req.role)) return true;
  if (req.role === "student") return submission.studentinfo?.toString() === req.userId;
  if (req.role === "teacher") {
    const assignment = await assignmentmodel.findById(submission.assignment).select("teacherinfo subjectinfo");
    return canReview(assignment, req);
  }
  return false;
}

submissionapp.post("/create/:id", verifyToken("student"), upload.single("file"), async (req, res) => {
  const assignment = await assignmentmodel.findById(req.params.id);
  if (!assignment) {
    removeStoredFiles(req.file ? [fileMeta(req.file)] : []);
    return res.status(404).json({ message: "Assignment not found" });
  }
  if (!req.file) return res.status(400).json({ message: "Submission file is required" });
  if (["draft", "closed"].includes(assignment.status)) return res.status(409).json({ message: "This assignment is not open for submissions" });
  const existing = await submissionmodel.findOne({ assignment: assignment._id, studentinfo: req.userId });
  const attachment = fileMeta(req.file);
  let submission;
  if (existing) {
    removeStoredFiles(existing.attachments);
    submission = await submissionmodel.findByIdAndUpdate(existing._id, {
      $set: {
        attachments: [attachment],
        status: "submitted",
        feedback: "",
        marksobtained: null,
        gradedBy: null,
        gradedAt: null,
        submittedAt: new Date(),
      },
      $inc: { attempt: 1 },
    }, { returnDocument: "after", runValidators: true });
  } else {
    submission = await submissionmodel.create({
      assignment: assignment._id,
      studentinfo: req.userId,
      attachments: [attachment],
    });
  }
  await assignmentmodel.findByIdAndUpdate(assignment._id, { $addToSet: { submissions: submission._id } });
  res.status(existing ? 200 : 201).json({ message: existing ? "Submission resubmitted successfully" : "Submission created successfully", payload: await populateSubmissions(submissionmodel.findById(submission._id)) });
});

submissionapp.get("/all", verifyToken(...ALL_ROLES), async (req, res) => {
  const filter = {};
  if (req.role === "student") filter.studentinfo = req.userId;
  if (req.role === "teacher") {
    const subjects = await subjectmodel.find({ $or: [{ teacherinfo: req.userId }, { additionalFaculty: req.userId }] }).select("_id");
    const assignments = await assignmentmodel.find({ subjectinfo: { $in: subjects.map((subject) => subject._id) } }).select("_id");
    filter.assignment = { $in: assignments.map((assignment) => assignment._id) };
  }
  if (req.role === "placement-office") {
    res.status(200).json({ message: "Submissions fetched successfully", payload: [] });
    return;
  }
  const submissions = await populateSubmissions(submissionmodel.find(filter).sort({ submittedAt: -1 }));
  res.status(200).json({ message: "Submissions fetched successfully", payload: submissions });
});

submissionapp.get("/info/:id", verifyToken(...ALL_ROLES), async (req, res) => {
  const submission = await submissionmodel.findById(req.params.id);
  if (!submission) return res.status(404).json({ message: "Submission not found" });
  if (!await canAccess(submission, req)) return res.status(403).json({ message: "You cannot access this submission" });
  res.status(200).json({ message: "Submission fetched successfully", payload: await populateSubmissions(submissionmodel.findById(submission._id)) });
});

submissionapp.get("/download/:id/:index", verifyToken(...ALL_ROLES), async (req, res) => {
  const submission = await submissionmodel.findById(req.params.id);
  if (!submission) return res.status(404).json({ message: "Submission not found" });
  if (!await canAccess(submission, req)) return res.status(403).json({ message: "You cannot access this submission" });
  const file = submission.attachments?.[Number(req.params.index)];
  if (!file) return res.status(404).json({ message: "Submission file not found" });
  res.download(storedFilePath(file.storageName), file.originalName);
});

submissionapp.patch("/review/:id", verifyToken("admin", "teacher", "hod"), async (req, res) => {
  const submission = await submissionmodel.findById(req.params.id);
  if (!submission) return res.status(404).json({ message: "Submission not found" });
  const assignment = await assignmentmodel.findById(submission.assignment);
  if (!await canReview(assignment, req)) return res.status(403).json({ message: "You cannot review this submission" });
  const status = ["under_review", "graded", "returned"].includes(req.body.status) ? req.body.status : "graded";
  const marks = Number(req.body.marksobtained);
  if (!Number.isFinite(marks) || marks < 0 || marks > assignment.maxmarks) {
    return res.status(400).json({ message: `Marks must be between 0 and ${assignment.maxmarks}` });
  }
  const updated = await submissionmodel.findByIdAndUpdate(submission._id, {
    $set: {
      marksobtained: marks,
      grade: String(req.body.grade || "").trim(),
      feedback: String(req.body.feedback || "").trim(),
      status,
      gradedBy: req.userId,
      gradedAt: new Date(),
    },
  }, { returnDocument: "after", runValidators: true });
  res.status(200).json({ message: "Assignment reviewed successfully", payload: await populateSubmissions(submissionmodel.findById(updated._id)) });
});

submissionapp.delete("/delete/:id", verifyToken(...ALL_ROLES), async (req, res) => {
  const submission = await submissionmodel.findById(req.params.id);
  if (!submission) return res.status(404).json({ message: "Submission not found" });
  if (req.role === "student" && submission.studentinfo?.toString() !== req.userId) return res.status(403).json({ message: "You cannot delete this submission" });
  if (["teacher", "hod", "admin"].includes(req.role) && !await canAccess(submission, req)) return res.status(403).json({ message: "You cannot delete this submission" });
  removeStoredFiles(submission.attachments);
  await Promise.all([
    submissionmodel.findByIdAndDelete(submission._id),
    assignmentmodel.findByIdAndUpdate(submission.assignment, { $pull: { submissions: submission._id } }),
  ]);
  res.status(200).json({ message: "Submission deleted successfully" });
});
