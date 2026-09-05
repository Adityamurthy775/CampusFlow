import mongoose, { Schema,Types,model, trusted } from "mongoose";
 const coursesschema=new Schema({
  collegeingo:{
    type:Types.ObjectId,
    ref:"college",
    required:true
  },
  deptinfo:{
    type:mongoose.Schema.types.ObjectId,
    ref:"dept",
    required:true
  },
  name:{
    type:String,
    required:true
  },
  code:{
    types:String,
    required:true
  },
  credits:{
    type:Number,
    required:true
  },
  duration:{
    type:Number,
    required:true
  },
  descp:{
    type:String,
    required:true
  }
 },{versionKey:false})

 export const coursesmodel=model("courses",coursesschema)
