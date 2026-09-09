import exp from "express"
import { coursesmodel } from "../modules/courses.js"

export const courseapp=exp.Router();

courseapp.post("/create",async(req,res)=>{
  //get the data from the body
  const courseinfo=req.body;
  //create a new doc
  const newdoc= new coursesmodel(courseinfo)
  //save the doc and send the res
  await newdoc.save();
  res.status(200).json({message:"course info added"})
})
//get the info of the courses
courseapp.get("/info/:id",async(req,res)=>{
  //get the id from the req
  const id =req.params.id;
  //find the course by id
  const result =await coursesmodel.findById(id).populate("collegeinfo").populate("deptinfo");
  //send the response
  if(!result){
    return res.status(404).json({message:"Course not found"})
  }
  res.status(201).json({message:"Course info",payload:result})
})
//update the course info
courseapp.patch("/update/:id",async(req,res)=>{
  //get the id and the data from the req
  const updateddata=req.body;
  const id=req.params.id;
  //find the course by id and update
  const result=await coursesmodel.findByIdAndUpdate(id,
    {$set:{...updateddata}},
    {returnDocument:"after"}
  )
  if(!result){
    return res.status(404).json({message:"cannot find the course"})
  }
  res.status(201).json({message:"course info updated",payload:result})
})
