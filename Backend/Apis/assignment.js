import exp from "express"
import { assignmentmodel } from "../modules/assignment.js"


export const assignmentapp=exp.Router()

assignmentapp.post("/create",async(req,res)=>{
  //get the data from the req
  const data=req.body;
  //create the document
  const newdoc=new assignmentmodel(data)
  //save the doc and send the res
  await newdoc.save()

  res.status(200).json({message:"assignment is created"})
})

//get update the assignment info
assignmentapp.patch("/update/:id",async(req,res)=>{
  //get the id and the data from the req
  const data=req.body
  const id=req.params.id
  //find the assignment by id and update the results
  const results=await assignmentmodel.findByIdAndUpdate(id,
    {$set:{...data}},
    {returnDocument:"after"}
  )
  if(!results){
    return res.status(404).json({message:"assignment not found"})
  }
  res.status(201).json({message:"assignment is updated",payload:results})
})
