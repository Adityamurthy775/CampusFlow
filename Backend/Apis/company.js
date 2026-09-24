import exp from "express";
import { companymodel } from "../modules/company.js";
import { verifyToken, ALL_ROLES } from "../middleware/verifyToken.js";

export const companyapp = exp.Router();
const managers = ["admin", "hod", "placement-office"];

companyapp.post("/create", verifyToken(...managers), async (req, res) => {
  const { collegeinfo, name, sector, industry, hrname, hrphno, hremail, descp, logo } = req.body;
  if (!name || !sector || !industry || !hrname || !hrphno || !hremail || !descp) {
    return res.status(400).json({ message: "Name, sector, industry, HR contact, and description are required" });
  }
  const company = await companymodel.create({ collegeinfo: collegeinfo || null, name, sector, industry, hrname, hrphno, hremail, descp, logo: logo || "", createdBy: req.userId });
  res.status(201).json({ message: "Company registered successfully", payload: company });
});

companyapp.get("/all", verifyToken(...ALL_ROLES), async (req, res) => {
  const companies = await companymodel.find().populate("collegeinfo", "name code").populate("createdBy", "username email role").sort({ name: 1 });
  res.status(200).json({ message: "Companies fetched successfully", payload: companies });
});

companyapp.get("/info/:id", verifyToken(...ALL_ROLES), async (req, res) => {
  const company = await companymodel.findById(req.params.id).populate("collegeinfo", "name code");
  if (!company) return res.status(404).json({ message: "Company not found" });
  res.status(200).json({ message: "Company fetched successfully", payload: company });
});

companyapp.patch("/update/:id", verifyToken(...managers), async (req, res) => {
  const fields = ["collegeinfo", "name", "sector", "industry", "hrname", "hrphno", "hremail", "descp", "logo", "isRecruiting"];
  const updates = Object.fromEntries(fields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));
  if (!Object.keys(updates).length) return res.status(400).json({ message: "No editable company fields were provided" });
  const company = await companymodel.findByIdAndUpdate(req.params.id, { $set: updates }, { returnDocument: "after", runValidators: true });
  if (!company) return res.status(404).json({ message: "Company not found" });
  res.status(200).json({ message: "Company updated successfully", payload: company });
});

companyapp.patch("/toggle-recruiting/:id", verifyToken(...managers), async (req, res) => {
  const company = await companymodel.findByIdAndUpdate(req.params.id, { $set: { isRecruiting: req.body.isRecruiting !== false } }, { returnDocument: "after" });
  if (!company) return res.status(404).json({ message: "Company not found" });
  res.status(200).json({ message: "Company recruitment status updated", payload: company });
});

companyapp.delete("/delete/:id", verifyToken(...managers), async (req, res) => {
  const company = await companymodel.findByIdAndDelete(req.params.id);
  if (!company) return res.status(404).json({ message: "Company not found" });
  res.status(200).json({ message: "Company deleted successfully" });
});
