import exp from "express"
import { studentmodel } from "../Models/studentmodule.js"
import { ReturnDocument } from "mongodb";

export const studentapp=exp.Router();


//add the addtional details for the student
studentapp.post("/basic-info",async(req,res)=>{
  //get the data from the req body
  const studentdata=req.body;
  //create a new documnet
  const studentdoc=new studentmodel(studentdata)
  //save the doc
  let result = await studentdoc.save();
  //send the resonse
  res.status(200).json({message:"user is created"})
})


//get the basic info of the student
studentapp.get("/info/:id",async(req,res)=>{
  //find the udet by the id from the url
  const id=req.params.id;
  //find the student details by id
  const student=await studentmodel.findById(id).populate("user","-password")

  if(!student){
    return res.status(404).json({message:"student not found"})
  }
  res.status(201).json({message:"student details",payload:student})
})

//update student profile
studentapp.patch("/update/:id",async(req,res)=>{
  //find the updated data from the body and the id from the url
  const updateddata=req.body;
  const id=req.params.id
  //find the uset by the id and upadte the user
  const result=await studentmodel.findByIdAndUpdate(id,
    {$set:{...updateddata}},
    {ReturnDocument:"after"}
  )
  if(!result){
    return res.status(404).json({message:"student not found"})
  }
  res.status(201).json({message:"student deatils updated successfully",payload:result})
})
