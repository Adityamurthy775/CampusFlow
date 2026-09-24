import exp from "express";
import { drivemodel } from "../modules/drive.js";
import { verifyToken, ALL_ROLES } from "../middleware/verifyToken.js";

export const driveapp = exp.Router();
const managers = ["admin", "hod", "placement-office"];

function populateDrives(query) {
  return query
    .populate("collegeinfo", "name code")
    .populate("courseinfo", "name code")
    .populate("deptinfo", "name code")
    .populate("companyinfo", "name sector industry")
    .populate("createdBy", "username email role");
}

driveapp.post("/create", verifyToken(...managers), async (req, res) => {
  const { companyinfo, name, jobType, descp, role, location, salary, eligibility, stages, applicationStart, applicationEnd, status } = req.body;
  if (!companyinfo || !name || !descp || !role || !salary || !applicationStart || !applicationEnd || new Date(applicationEnd) < new Date(applicationStart)) {
    return res.status(400).json({ message: "Company, name, description, role, salary, and valid application dates are required" });
  }
  const payload = { companyinfo, name, jobType, descp, role, location, salary, eligibility, stages, applicationStart, applicationEnd, status, createdBy: req.userId };
  for (const key of ["collegeinfo", "courseinfo", "deptinfo"]) if (req.body[key]) payload[key] = req.body[key];
  const drive = await drivemodel.create(payload);
  res.status(201).json({ message: "Placement drive created successfully", payload: await populateDrives(drivemodel.findById(drive._id)) });
});

driveapp.get("/all", verifyToken(...ALL_ROLES), async (req, res) => {
  const drives = await populateDrives(drivemodel.find().sort({ applicationStart: -1 }));
  res.status(200).json({ message: "Drives fetched successfully", payload: drives });
});

driveapp.get("/info/:id", verifyToken(...ALL_ROLES), async (req, res) => {
  const drive = await drivemodel.findById(req.params.id);
  if (!drive) return res.status(404).json({ message: "Drive not found" });
  res.status(200).json({ message: "Drive fetched successfully", payload: await populateDrives(drivemodel.findById(drive._id)) });
});

driveapp.patch("/update/:id", verifyToken(...managers), async (req, res) => {
  const fields = ["collegeinfo", "courseinfo", "deptinfo", "companyinfo", "name", "jobType", "descp", "role", "location", "salary", "eligibility", "stages", "applicationStart", "applicationEnd", "status"];
  const updates = Object.fromEntries(fields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));
  if (!Object.keys(updates).length) return res.status(400).json({ message: "No editable drive fields were provided" });
  const drive = await drivemodel.findByIdAndUpdate(req.params.id, { $set: updates }, { returnDocument: "after", runValidators: true });
  if (!drive) return res.status(404).json({ message: "Drive not found" });
  res.status(200).json({ message: "Drive updated successfully", payload: await populateDrives(drivemodel.findById(drive._id)) });
});

driveapp.patch("/update-status/:id", verifyToken(...managers), async (req, res) => {
  if (!["open", "closed", "in_progress", "completed", "cancelled"].includes(req.body.status)) return res.status(400).json({ message: "A valid drive status is required" });
  const drive = await drivemodel.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } }, { returnDocument: "after", runValidators: true });
  if (!drive) return res.status(404).json({ message: "Drive not found" });
  res.status(200).json({ message: "Drive status updated successfully", payload: drive });
});

driveapp.delete("/delete/:id", verifyToken(...managers), async (req, res) => {
  const drive = await drivemodel.findByIdAndDelete(req.params.id);
  if (!drive) return res.status(404).json({ message: "Drive not found" });
  res.status(200).json({ message: "Drive deleted successfully" });
});
