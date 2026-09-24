import exp from "express";
import {deptmodel} from "../modules/department.js"
import { verifyToken } from "../middleware/verifyToken.js"

export const deptapp=exp.Router();

//crete a new dept
deptapp.post("/create",verifyToken("admin","hod"),async(req,res)=>{
  //get the data from the body
  const deptdata=req.body;
  //validate required fields
  if(!deptdata.name || !deptdata.collegeinfo){
    return res.status(400).json({message:"Department name and college reference are required"})
  }
  //create the new document
  const newdoc= new deptmodel(deptdata);
  //save the document
  const saved=await newdoc.save();
  //send the response
  res.status(201).json({message:"Department created successfully",payload:saved})
})

deptapp.patch("/update/:id",verifyToken("admin","hod"),async(req,res)=>{
  //get the id and the modified data from the body and the url
  const id=req.params.id;
  const updateddata=req.body;
  //find the dept by id and update the data
  const result=await deptmodel.findByIdAndUpdate(id,
    {$set:{...updateddata}},
    {returnDocument:"after"}
  )
  if(!result){
    return res.status(404).json({message:"Department not found"})
  }
  res.status(200).json({message:"Department info updated successfully",payload:result})
})
//deptartment info
deptapp.get("/info/:id",async(req,res)=>{
  //get the id from the url parameter
  const id =req.params.id;
  //find the dept based in the id
  const result=await deptmodel.findById(id).populate("collegeinfo").populate("hodid","-password");
  if(!result){
    return res.status(404).json({message:"Department not found"})
  }
  res.status(200).json({message:"Department info fetched successfully",payload:result})
})

//get all departments
deptapp.get("/all",async(req,res)=>{
  const depts=await deptmodel.find().populate("collegeinfo","name code").populate("hodid","-password")
  res.status(200).json({message:"Departments fetched successfully",payload:depts})
})

//delete department
deptapp.delete("/delete/:id",verifyToken("admin","hod"),async(req,res)=>{
  const id=req.params.id
  const result=await deptmodel.findByIdAndDelete(id)
  if(!result){
    return res.status(404).json({message:"Department not found"})
  }
  res.status(200).json({message:"Department deleted successfully",payload:result})
})
