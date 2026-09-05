import { Schema,Types,model } from "mongoose";
  const deptschema=new Schema({
    collegeinfo:{
      type:Types.ObjectId,
      ref:"college",
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
    hodid:{
      type:Types.ObjectId,
      ref:"user",
      required:true
    },
    descp:{
      type:String,
      required:true
    }
  },{versionKey:false})


export const  deptmodel=model("dept",deptschema)
