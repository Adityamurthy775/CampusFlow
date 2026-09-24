import exp from "express"
import { facultymodel } from "../modules/faculty.js"
import { verifyToken, ALL_ROLES } from "../middleware/verifyToken.js"

export const facultyapp=exp.Router();

facultyapp.get("/all",verifyToken("admin","student","teacher","hod","placement-office"),async(req,res)=>{
  const faculty=await facultymodel.find({isActive:{$ne:false}})
    .populate("user","username email role department branch")
    .populate("collegeinfo","name code")
    .populate("deptinfo","name code")
    .sort({employeeCode:1});
  res.status(200).json({message:"Faculty fetched successfully",payload:faculty})
})

//add the basic info of the teacher
facultyapp.post("/basic-info",verifyToken("admin","hod"),async(req,res)=>{
  //get the data from the  body
  const data=req.body;
  //validate required user reference
  if(!data.user){
    return res.status(400).json({message:"user reference is required"})
  }
  //check for duplicate faculty profile
  const existing=await facultymodel.findOne({user:data.user})
  if(existing){
    return res.status(409).json({message:"Faculty profile already exists for this user"})
  }
  //cretae a new document
  const newdoc= new facultymodel(data)
  //save the doc
  const saved=await newdoc.save();
  //send the response
  res.status(201).json({message:"Faculty profile created successfully",payload:saved})
})

//get the info of the faculty
facultyapp.get("/info/:id",verifyToken(...ALL_ROLES),async(req,res)=>{
  //get the  id from url parameter
  const id=req.params.id;
  //find the teacher by if
  const result=await facultymodel.findById(id).populate("user","-password").populate("collegeinfo").populate("deptinfo");
  if(!result){
    return res.status(404).json({message:"Faculty not found"})
  }
  res.status(200).json({message:"Faculty info fetched successfully",payload:result})
})

//update the faculty info
facultyapp.patch("/update/:id",verifyToken("admin","hod"),async(req,res)=>{
  //get the faculty data and the id from the req
  const updateddata=req.body;
  const id=req.params.id;
  //find the faculty by id and update and then send response
  const result =await facultymodel.findByIdAndUpdate(id,
    {$set:{...updateddata}},
    {returnDocument:"after"}
  )
  if(!result){
    return res.status(404).json({message:"Faculty not found"})
  }
  res.status(200).json({message:"Faculty data updated successfully",payload:result})
})
