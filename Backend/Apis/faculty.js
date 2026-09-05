import exp from "express"
import { facultymodel } from "../Models/faculty.js"

export const facultyapp=exp.Router();

//add the basic info of the teacher
facultyapp.post("/basic-info",async(req,res)=>{
  //get the data from the  body
  const data=req.body;
  //cretae a new document
  const newdoc= new facultymodel(data)
  //save the doc
  await newdoc.save();
  //send the response
  res.status(201).json({message:"updated the data"})
})

//get the info of the faculty
facultyapp.get("/info/:id",async(req,res)=>{
  //get the  id from url parameter
  const id=req.params.id;
  //find the teacher by if
  const result=await facultymodel.findById(id).populate("user","-password").populate("collegeinfo").populate("deptinfo");
  if(!result){
    return res.status(404).json({message:"faculty not found"})
  }
  res.status(201).json({message:"Faculty info",payload:result})
})
