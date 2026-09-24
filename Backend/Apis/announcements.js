import exp from "express";
import { announcementmodel } from "../modules/announcement.js";
import { verifyToken, ALL_ROLES } from "../middleware/verifyToken.js";

export const announcementapp = exp.Router();

function populateAnnouncements(query) {
  return query
    .populate("coursesinfo", "name code")
    .populate("deptinfo", "name code")
    .populate("postedby", "username email role");
}

function canManage(announcement, req) {
  return ["admin", "hod"].includes(req.role) || announcement.postedby?.toString() === req.userId;
}

announcementapp.post("/create", verifyToken("admin", "teacher", "hod", "placement-office"), async (req, res) => {
  const { coursesinfo, deptinfo, name, content, priority } = req.body;
  if (!name || !content) return res.status(400).json({ message: "Announcement name and content are required" });
  const announcement = await announcementmodel.create({
    coursesinfo: coursesinfo || null,
    deptinfo: deptinfo || null,
    name,
    content,
    priority: ["low", "normal", "high", "urgent"].includes(priority) ? priority : "normal",
    postedby: req.userId,
  });
  res.status(201).json({ message: "Announcement created successfully", payload: await populateAnnouncements(announcementmodel.findById(announcement._id)) });
});

announcementapp.get("/all", verifyToken(...ALL_ROLES), async (req, res) => {
  const announcements = await populateAnnouncements(announcementmodel.find().sort({ ispinned: -1, createdAt: -1 }));
  res.status(200).json({ message: "Announcements fetched successfully", payload: announcements });
});

announcementapp.get("/info/:id", verifyToken(...ALL_ROLES), async (req, res) => {
  const announcement = await announcementmodel.findById(req.params.id);
  if (!announcement) return res.status(404).json({ message: "Announcement not found" });
  res.status(200).json({ message: "Announcement fetched successfully", payload: await populateAnnouncements(announcementmodel.findById(announcement._id)) });
});

announcementapp.patch("/update/:id", verifyToken("admin", "teacher", "hod", "placement-office"), async (req, res) => {
  const announcement = await announcementmodel.findById(req.params.id);
  if (!announcement) return res.status(404).json({ message: "Announcement not found" });
  if (!canManage(announcement, req)) return res.status(403).json({ message: "You cannot update this announcement" });
  const fields = ["coursesinfo", "deptinfo", "name", "content", "priority"];
  const updates = Object.fromEntries(fields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));
  if (!Object.keys(updates).length) return res.status(400).json({ message: "No editable announcement fields were provided" });
  const updated = await announcementmodel.findByIdAndUpdate(announcement._id, { $set: updates }, { returnDocument: "after", runValidators: true });
  res.status(200).json({ message: "Announcement updated successfully", payload: await populateAnnouncements(announcementmodel.findById(updated._id)) });
});

announcementapp.patch("/pin/:id", verifyToken("admin", "teacher", "hod", "placement-office"), async (req, res) => {
  const announcement = await announcementmodel.findById(req.params.id);
  if (!announcement) return res.status(404).json({ message: "Announcement not found" });
  if (!canManage(announcement, req)) return res.status(403).json({ message: "You cannot pin this announcement" });
  announcement.ispinned = !announcement.ispinned;
  const updated = await announcement.save();
  res.status(200).json({ message: "Announcement pin status updated", payload: updated });
});

announcementapp.delete("/delete/:id", verifyToken("admin", "teacher", "hod", "placement-office"), async (req, res) => {
  const announcement = await announcementmodel.findById(req.params.id);
  if (!announcement) return res.status(404).json({ message: "Announcement not found" });
  if (!canManage(announcement, req)) return res.status(403).json({ message: "You cannot delete this announcement" });
  await announcementmodel.findByIdAndDelete(announcement._id);
  res.status(200).json({ message: "Announcement deleted successfully" });
});
