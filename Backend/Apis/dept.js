import exp from "express";
import {deptmodel} from "../Models/department.js"

export const deptapp=exp.Router();

//crete a new dept
deptapp.post("/create",async(req,res)=>{
  //get the data from the body
  const deptdata=req.body;
  //create the new document
  const newdoc= new deptmodel(deptdata);
  //save the document
  await newdoc.save();
  //send the response
  res.status(200).json({message:"department created"})
})

deptapp.post("/update/:id",async(req,res)=>{
  //get the id and the modified data from the body and the url
  const id=req.params.id;
  const updateddata=req.body;
  //find the dept by id and update the data
  const result=await deptmodel.findByIdAndUpdate(id,
    {$set:{...updateddata}},
    {returnDocument:"after"}
  )
  if(!result){
    return res.status(404).json({message:"dept info not found"})
  }
  res.status(201).json({message:"department inof updated ",payload:result})
})
//deptartment info
deptapp.get("/info/:id",async(req,res)=>{
  //get the id from the url parameter
  const id =req.params.id;
  //find the dept based in the id
  const result=await deptmodel.findById(id).populate("collegeinfo").populate("hodid","-password");
  if(!result){
    return res.status(404).json({message:"dept info not found"})
  }
  res.status(201).json({message:"deptartment info",payload:result})
})
