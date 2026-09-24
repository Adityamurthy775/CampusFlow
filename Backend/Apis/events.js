import exp from "express";
import { eventmodel } from "../modules/events.js";
import { verifyToken, ALL_ROLES } from "../middleware/verifyToken.js";

export const eventapp = exp.Router();

function populateEvents(query) {
  return query
    .populate("coursesinfo", "name code")
    .populate("deptinfo", "name code")
    .populate("createdBy", "username email role");
}

function canManage(event, req) {
  return ["admin", "hod"].includes(req.role) || event.createdBy?.toString() === req.userId;
}

eventapp.post("/create", verifyToken(...ALL_ROLES), async (req, res) => {
  const { coursesinfo, deptinfo, name, decp, catogery, startdate, enddate, members, logo } = req.body;
  if (!name || !decp || !catogery || !startdate || !enddate || new Date(enddate) < new Date(startdate)) {
    return res.status(400).json({ message: "Name, description, category, and valid start/end dates are required" });
  }
  const privileged = ["admin", "hod", "placement-office"].includes(req.role);
  const event = await eventmodel.create({
    coursesinfo: coursesinfo || null,
    deptinfo: deptinfo || null,
    name,
    decp,
    catogery,
    startdate,
    enddate,
    members: Number(members) || 0,
    logo: logo || "",
    createdBy: req.userId,
    status: privileged && req.body.status === "published" ? "published" : "pending",
  });
  res.status(201).json({ message: "Event created successfully", payload: await populateEvents(eventmodel.findById(event._id)) });
});

eventapp.get("/all", verifyToken(...ALL_ROLES), async (req, res) => {
  const events = await populateEvents(eventmodel.find().sort({ startdate: 1 }));
  res.status(200).json({ message: "Events fetched successfully", payload: events });
});

eventapp.get("/info/:id", verifyToken(...ALL_ROLES), async (req, res) => {
  const event = await eventmodel.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.status(200).json({ message: "Event fetched successfully", payload: await populateEvents(eventmodel.findById(event._id)) });
});

eventapp.patch("/update/:id", verifyToken(...ALL_ROLES), async (req, res) => {
  const event = await eventmodel.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  if (!canManage(event, req)) return res.status(403).json({ message: "You cannot update this event" });
  const fields = ["coursesinfo", "deptinfo", "name", "decp", "catogery", "startdate", "enddate", "members", "logo", "status"];
  const updates = Object.fromEntries(fields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));
  if (!["admin", "hod", "placement-office"].includes(req.role)) delete updates.status;
  if (!Object.keys(updates).length) return res.status(400).json({ message: "No editable event fields were provided" });
  const updated = await eventmodel.findByIdAndUpdate(event._id, { $set: updates }, { returnDocument: "after", runValidators: true });
  res.status(200).json({ message: "Event updated successfully", payload: await populateEvents(eventmodel.findById(updated._id)) });
});

eventapp.delete("/delete/:id", verifyToken(...ALL_ROLES), async (req, res) => {
  const event = await eventmodel.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  if (!canManage(event, req)) return res.status(403).json({ message: "You cannot delete this event" });
  await eventmodel.findByIdAndDelete(event._id);
  res.status(200).json({ message: "Event deleted successfully" });
});
