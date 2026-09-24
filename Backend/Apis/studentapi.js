import exp from "express"
import { studentmodel } from "../modules/studentmodule.js"
import { verifyToken } from "../middleware/verifyToken.js"

export const studentapp=exp.Router();


//add the addtional details for the student
studentapp.post("/basic-info",verifyToken("admin","student","hod","teacher"),async(req,res)=>{
  //get the data from the req body
  const studentdata=req.body;
  //validate required fields
  if(!studentdata.user){
    return res.status(400).json({message:"user reference is required"})
  }
  //check if a profile already exists for this user
  const existing=await studentmodel.findOne({user:studentdata.user})
  if(existing){
    return res.status(409).json({message:"Student profile already exists for this user"})
  }
  //create a new documnet
  const studentdoc=new studentmodel(studentdata)
  //save the doc
  let result = await studentdoc.save();
  //send the resonse
  res.status(201).json({message:"Student profile created successfully",payload:result})
})


//get the basic info of the student
studentapp.get("/info/:id",verifyToken("admin","student","hod","teacher","placement-office"),async(req,res)=>{
  //find the udet by the id from the url
  const id=req.params.id;
  //find the student details by id
  const student=await studentmodel.findById(id).populate("user","-password")

  if(!student){
    return res.status(404).json({message:"Student not found"})
  }
  res.status(200).json({message:"Student details fetched successfully",payload:student})
})

//update student profile
studentapp.patch("/update/:id",verifyToken("admin","student","hod","teacher"),async(req,res)=>{
  //find the updated data from the body and the id from the url
  const updateddata=req.body;
  const id=req.params.id
  //find the uset by the id and upadte the user
  const result=await studentmodel.findByIdAndUpdate(id,
    {$set:{...updateddata}},
    {returnDocument:"after"}
  )
  if(!result){
    return res.status(404).json({message:"Student not found"})
  }
  res.status(200).json({message:"Student details updated successfully",payload:result})
})
