import mongoose, { Schema,Types,model, trusted } from "mongoose";
 const coursesschema=new Schema({
  collegeinfo:{
    type:Types.ObjectId,
    ref:"college",
    required:true
  },
  deptinfo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"dept",
    required:true
  },
  name:{
    type:String,
    required:true
  },
  code:{
    type:String,
    required:true
  },
  credits:{
    type:Number,
    required:true
  },
  duration:{
    type:String,
    required:true
  },
  descp:{
    type:String,
    required:true
  }
 },{versionKey:false})

 export const coursesmodel=model("courses",coursesschema)
