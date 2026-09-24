import exp from "express";
import { requestmodel } from "../modules/request.js";
import { verifyToken, ALL_ROLES } from "../middleware/verifyToken.js";
import { upload, fileMeta, storedFilePath, removeStoredFiles } from "../middleware/upload.js";

export const requestapp = exp.Router();

function populateRequests(query) {
  return query
    .populate("userinfo", "username email role department branch")
    .populate("reviewedBy", "username email role");
}

function canReview(req) {
  return ["admin", "hod"].includes(req.role);
}

requestapp.post("/create", verifyToken(...ALL_ROLES), upload.single("file"), async (req, res) => {
  const { catogery, title, subject, fromDate, toDate, priority } = req.body;
  if (!catogery || !title || !subject) {
    removeStoredFiles(req.file ? [fileMeta(req.file)] : []);
    return res.status(400).json({ message: "Category, title, and subject are required" });
  }
  if (catogery === "leave" && (!fromDate || !toDate || new Date(toDate) < new Date(fromDate))) {
    removeStoredFiles(req.file ? [fileMeta(req.file)] : []);
    return res.status(400).json({ message: "Leave requests require valid start and end dates" });
  }
  const saved = await requestmodel.create({
    userinfo: req.userId,
    catogery,
    title,
    subject,
    fromDate: fromDate || null,
    toDate: toDate || null,
    priority: ["low", "normal", "high", "urgent"].includes(priority) ? priority : "normal",
    attachments: req.file ? [fileMeta(req.file)] : [],
    history: [{ action: "submitted", actor: req.userId, comment: "" }],
  });
  res.status(201).json({ message: "Request submitted successfully", payload: await populateRequests(requestmodel.findById(saved._id)) });
});

requestapp.get("/all", verifyToken(...ALL_ROLES), async (req, res) => {
  const filter = canReview(req) ? {} : { userinfo: req.userId };
  const requests = await populateRequests(requestmodel.find(filter).sort({ createdAt: -1 }));
  res.status(200).json({ message: "Requests fetched successfully", payload: requests });
});

requestapp.get("/user/:userId", verifyToken(...ALL_ROLES), async (req, res) => {
  if (req.params.userId !== req.userId && !canReview(req)) return res.status(403).json({ message: "You cannot access these requests" });
  const requests = await populateRequests(requestmodel.find({ userinfo: req.params.userId }).sort({ createdAt: -1 }));
  res.status(200).json({ message: "User requests fetched successfully", payload: requests });
});

requestapp.get("/info/:id", verifyToken(...ALL_ROLES), async (req, res) => {
  const request = await requestmodel.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (!canReview(req) && request.userinfo?.toString() !== req.userId) return res.status(403).json({ message: "You cannot access this request" });
  res.status(200).json({ message: "Request fetched successfully", payload: await populateRequests(requestmodel.findById(request._id)) });
});

requestapp.get("/download/:id/:index", verifyToken(...ALL_ROLES), async (req, res) => {
  const request = await requestmodel.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (!canReview(req) && request.userinfo?.toString() !== req.userId) return res.status(403).json({ message: "You cannot access this request" });
  const file = request.attachments?.[Number(req.params.index)];
  if (!file) return res.status(404).json({ message: "Attachment not found" });
  res.download(storedFilePath(file.storageName), file.originalName);
});

requestapp.patch("/update/:id", verifyToken(...ALL_ROLES), async (req, res) => {
  const request = await requestmodel.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (!canReview(req) && (request.userinfo?.toString() !== req.userId || request.action !== "submitted")) {
    return res.status(403).json({ message: "You cannot update this request" });
  }
  const fields = canReview(req)
    ? ["catogery", "title", "subject", "fromDate", "toDate", "priority"]
    : ["title", "subject", "fromDate", "toDate", "priority"];
  const updates = Object.fromEntries(fields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));
  if (!Object.keys(updates).length) return res.status(400).json({ message: "No editable request fields were provided" });
  const updated = await requestmodel.findByIdAndUpdate(request._id, { $set: updates }, { returnDocument: "after", runValidators: true });
  res.status(200).json({ message: "Request updated successfully", payload: await populateRequests(requestmodel.findById(updated._id)) });
});

requestapp.patch("/review/:id", verifyToken("admin", "hod"), async (req, res) => {
  const request = await requestmodel.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  const action = req.body.action;
  if (!["reviewed", "approved", "rejected", "escalated", "commented"].includes(action)) {
    return res.status(400).json({ message: "A valid review action is required" });
  }
  const updated = await requestmodel.findByIdAndUpdate(request._id, {
    $set: {
      action,
      priority: ["low", "normal", "high", "urgent"].includes(req.body.priority) ? req.body.priority : request.priority,
      reviewComment: String(req.body.comment || "").trim(),
      reviewedBy: req.userId,
      reviewedAt: new Date(),
    },
    $push: { history: { action, actor: req.userId, comment: String(req.body.comment || "").trim() } },
  }, { returnDocument: "after", runValidators: true });
  res.status(200).json({ message: "Request reviewed successfully", payload: await populateRequests(requestmodel.findById(updated._id)) });
});

requestapp.delete("/delete/:id", verifyToken(...ALL_ROLES), async (req, res) => {
  const request = await requestmodel.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (!canReview(req) && (request.userinfo?.toString() !== req.userId || request.action !== "submitted")) {
    return res.status(403).json({ message: "You cannot delete this request" });
  }
  removeStoredFiles(request.attachments);
  await requestmodel.findByIdAndDelete(request._id);
  res.status(200).json({ message: "Request deleted successfully" });
});
