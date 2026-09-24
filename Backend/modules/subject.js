import { Schema,Types,model } from "mongoose";

const subjectschema=new Schema({
  collegeinfo:{
    type:Types.ObjectId,
    ref:"college",
    required:true
  },
  deptinfo:{
    type:Types.ObjectId,
    ref:"dept",
    required:true
  },
  courseinfo:{
    type:Types.ObjectId,
    ref:"courses",
    required:true
  },
  teacherinfo:{
    type:Types.ObjectId,
    ref:"user",
    required:true
  },
  additionalFaculty:[{
    type:Types.ObjectId,
    ref:"user"
  }],
  name:{
    type:String,
    required:true
  },
  code:{
    type:String,
    required:true
  },
  descp:{
    type:String,
    required:true
  },
  credits:{
    type:Number,
    required:true
  },
  year:{
    type:Number,
    enum:[1,2,3,4]
  },
  semester:{
    type:Number,
    enum:[1,2]
  },
  branch:{
    type:String,
    trim:true
  }
},{versionKey:false})


export const subjectmodel= model("subject",subjectschema)
