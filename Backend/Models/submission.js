import { Schema,Types,model } from "mongoose";
import { assignmentmodel } from "./assignment";
const submissionschema = new Schema({
  courseinfo:{
    type:Types.ObjectId,
    ref:"courses",
    required:true
  },
  deptinof:{
    type:Types.ObjectId,
    ref:"dept",
    required:true
  },
  studentinfo:{
    type:Types.ObjectId,
    ref:"user",
    required:true
  },
  assignmentinfo:{
    type:Types.ObjectId,
    ref:"assignment",
    required:true
  },
  marksobtained:{
    type:Number,
    required:true
  },
  grade:{
    type:String,
    required:true
  }
},{versionKey:false})
export const  submissionmodel=model("submission",submissionschema)
