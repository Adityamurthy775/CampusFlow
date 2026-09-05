import { Schema,Types,model } from "mongoose";
 const assignmentschema=new Schema({
  departinfo:{
    type:Types.ObjectId,
    ref:"dept",
    required:true
  },
  subject:{
    type:Types.ObjectId,
    ref:"subject",
    required:true
  },
  teacherinfo:{
    type:Types.ObjectId,
    ref:"user",
    required:true
  },
  name:{
    type:String,
    required:true,
  },
  descp:{
    type:String,
    required:true
  },
  instructions:{
    type:String,
    required:true
  },
  maxmarks:{
    type:Number,
    required:true,
    default:100
  },
  duedate:{
    type:String,
    required:true
  }

 },{versionKey:false,timestamps:false})


 export const assignmentmodel=model("asssignment",assignmentschema)
