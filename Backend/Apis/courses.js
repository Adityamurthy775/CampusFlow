import exp from "express"
import { coursesmodel } from "../modules/courses.js"
import { verifyToken } from "../middleware/verifyToken.js"

export const courseapp=exp.Router();

courseapp.post("/create",verifyToken("admin","hod"),async(req,res)=>{
  //get the data from the body
  const courseinfo=req.body;
  //validate required fields
  if(!courseinfo.name || !courseinfo.code){
    return res.status(400).json({message:"Course name and code are required"})
  }
  //create a new doc
  const newdoc= new coursesmodel(courseinfo)
  //save the doc and send the res
  const saved=await newdoc.save();
  res.status(201).json({message:"Course info added successfully",payload:saved})
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
  res.status(200).json({message:"Course info fetched successfully",payload:result})
})
//update the course info
courseapp.patch("/update/:id",verifyToken("admin","hod"),async(req,res)=>{
  //get the id and the data from the req
  const updateddata=req.body;
  const id=req.params.id;
  //find the course by id and update
  const result=await coursesmodel.findByIdAndUpdate(id,
    {$set:{...updateddata}},
    {returnDocument:"after"}
  )
  if(!result){
    return res.status(404).json({message:"Course not found"})
  }
  res.status(200).json({message:"Course info updated successfully",payload:result})
})

//get all courses
courseapp.get("/all",async(req,res)=>{
  const courses=await coursesmodel.find().populate("collegeinfo","name code").populate("deptinfo","name")
  res.status(200).json({message:"Courses fetched successfully",payload:courses})
})

//delete a course
courseapp.delete("/delete/:id",verifyToken("admin","hod"),async(req,res)=>{
  const id=req.params.id
  const result=await coursesmodel.findByIdAndDelete(id)
  if(!result){
    return res.status(404).json({message:"Course not found"})
  }
  res.status(200).json({message:"Course deleted successfully",payload:result})
})
