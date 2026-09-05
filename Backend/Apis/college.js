import exp from "express"
import {collegemodel} from'../Models/college.js'

export const collegeapp=exp.Router();

//create an collge docment
collegeapp.post("/info",async(req,res)=>{
  //get the data from the body
  const collegedata=req.body;
  //create an new document
  let newdoc= new collegemodel(collegedata);
  //save the new document
  await newdoc.save();
  //send the response
  res.status(200).json({message:"college info created"})
})

//update the college info
collegeapp.patch("/update/:id",async(req,res)=>{
  //get the data from the body and the id from the url parameter
  const updateddata=req.body;
  const id=req.params.id;
  //find the college and update the results
  const result=await collegemodel.findByIdAndUpdate(id,
    {$set:{...updateddata}},
    {returnDocument:"after"}
  )
  if(!result){
    return res.status(404).json({message:"college not found"})
  }
  res.status(201).json({message:"updated the college info",payload:result})
})
