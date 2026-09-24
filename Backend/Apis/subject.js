import exp from "express"
import { subjectmodel } from "../modules/subject.js"
import { btech3Curriculum } from "../modules/btech3Curriculum.js"
import { verifyToken, ALL_ROLES } from "../middleware/verifyToken.js"

export const subjectapp=exp.Router();

subjectapp.post("/create",verifyToken("admin","hod"),async(req,res)=>{
  const data=req.body;
  if(!data.name || !data.code){
    return res.status(400).json({message:"Subject name and code are required"})
  }
  const newdoc=new subjectmodel(data);
  const saved=await newdoc.save();
  res.status(201).json({message:"Subject created successfully",payload:saved})
})

subjectapp.get("/curriculum/btech-3",(req,res)=>{
  const requestedDay=req.query.day?.trim();
  if(!requestedDay){
    return res.status(200).json({message:"B.Tech third-year curriculum fetched successfully",payload:btech3Curriculum})
  }
  const day=btech3Curriculum.weeklySchedule.find(item=>item.day.toLowerCase()===requestedDay.toLowerCase());
  if(!day){
    return res.status(404).json({message:"Curriculum day not found"})
  }
  res.status(200).json({
    message:"B.Tech third-year curriculum fetched successfully",
    payload:{...btech3Curriculum,weeklySchedule:[day]}
  })
})

subjectapp.get("/info/:id",verifyToken(...ALL_ROLES),async(req,res)=>{
  const result=await subjectmodel.findById(req.params.id)
    .populate("collegeinfo","name code")
    .populate("deptinfo","name")
    .populate("courseinfo","name code")
    .populate("teacherinfo","username email role department branch")
    .populate("additionalFaculty","username email role department branch");
  if(!result){
    return res.status(404).json({message:"Subject not found"})
  }
  res.status(200).json({message:"Subject details fetched successfully",payload:result})
})

subjectapp.patch("/update/:id",verifyToken("admin","hod"),async(req,res)=>{
  const result=await subjectmodel.findByIdAndUpdate(
    req.params.id,
    {$set:{...req.body}},
    {new:true,runValidators:true}
  );
  if(!result){
    return res.status(404).json({message:"Subject not found"})
  }
  res.status(200).json({message:"Subject data updated successfully",payload:result})
})

subjectapp.get("/all",verifyToken(...ALL_ROLES),async(req,res)=>{
  const subjects=await subjectmodel.find()
    .populate("collegeinfo","name code")
    .populate("deptinfo","name")
    .populate("courseinfo","name code")
    .populate("teacherinfo","username email role department branch")
    .populate("additionalFaculty","username email role department branch");
  res.status(200).json({message:"Subjects fetched successfully",payload:subjects})
})

subjectapp.delete("/delete/:id",verifyToken("admin","hod"),async(req,res)=>{
  const result=await subjectmodel.findByIdAndDelete(req.params.id);
  if(!result){
    return res.status(404).json({message:"Subject not found"})
  }
  res.status(200).json({message:"Subject deleted successfully",payload:result})
})
