import exp from "express"
import {collegemodel} from'../modules/college.js'
import { verifyToken } from "../middleware/verifyToken.js"

export const collegeapp=exp.Router();

//create an collge docment
collegeapp.post("/info",verifyToken("admin","hod"),async(req,res)=>{
  //get the data from the body
  const collegedata=req.body;
  //validate required fields
  if(!collegedata.name || !collegedata.code){
    return res.status(400).json({message:"College name and code are required"})
  }
  //check for duplicate college by code
  const existing=await collegemodel.findOne({code:collegedata.code})
  if(existing){
    return res.status(409).json({message:"College with this code already exists"})
  }
  //create an new document
  let newdoc= new collegemodel(collegedata);
  //save the new document
  const saved=await newdoc.save();
  //send the response
  res.status(201).json({message:"College info created successfully",payload:saved})
})

//get all colleges
collegeapp.get("/all",async(req,res)=>{
  const colleges=await collegemodel.find()
  res.status(200).json({message:"Colleges fetched successfully",payload:colleges})
})

//get a single college
collegeapp.get("/info/:id",async(req,res)=>{
  const id=req.params.id
  const college=await collegemodel.findById(id)
  if(!college){
    return res.status(404).json({message:"College not found"})
  }
  res.status(200).json({message:"College info fetched successfully",payload:college})
})

//update the college info
collegeapp.patch("/update/:id",verifyToken("admin","hod"),async(req,res)=>{
  //get the data from the body and the id from the url parameter
  const updateddata=req.body;
  const id=req.params.id;
  //find the college and update the results
  const result=await collegemodel.findByIdAndUpdate(id,
    {$set:{...updateddata}},
    {returnDocument:"after"}
  )
  if(!result){
    return res.status(404).json({message:"College not found"})
  }
  res.status(200).json({message:"College info updated successfully",payload:result})
})

//delete the college
collegeapp.delete("/delete/:id",verifyToken("admin","hod"),async(req,res)=>{
  const id=req.params.id
  const result=await collegemodel.findByIdAndDelete(id)
  if(!result){
    return res.status(404).json({message:"College not found"})
  }
  res.status(200).json({message:"College deleted successfully",payload:result})
})
