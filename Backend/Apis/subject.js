import exp from "express"
import { subjectmodel } from "../modules/subject.js"


export const subjectapp=exp.Router();

subjectapp.post("/create",async(req,res)=>{
  //get the data from the req
  const data=req.body;
  //create a new doc
  const newdoc= new subjectmodel(data);
  //save the doc and send the res
  await newdoc.save();
  res.status(200).json({message:"subject is created"})
})

subjectapp.get("/info/:id",async(req,res)=>{
  //get the id from the req
  const id =req.params.id;
  //find the subject from the id
  const result=await subjectmodel.findById(id).populate("collegeinfo").populate("deptinfo").populate("courseinfo").populate("teacherinfo");
  //send the response
  if(!result){
    return res.status(404).json({message:"cannot find the meaasge"})
  }
  res.status(201).json({message:"subject deatils",payload:result})
})


subjectapp.patch("/update/:id",async(req,res)=>{
  //get the id nd the data from the req
  const updateddata=req.body;
  const id=req.params.id;
  //find the data from the id and update the id
  const result=await subjectmodel.findByIdAndUpdate(id,
    {$set:{...updateddata}},
    {returnDocument:"after"}
  )
  if(!result){
    return res.status(404).json({message:"cannot find the subject"})
  }
  res.status(201).json({message:"subject datz is updated",payload:result})
})
