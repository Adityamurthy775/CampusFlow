import { Schema,Types,model } from "mongoose";
const companyschema=new Schema({
  collegeinfo:{
    type:Types.ObjectId,
    ref:"college",
    required:true
  },
  name:{
    type:String,
    required:true
  },
  sector:{
    type:String,
    required:true
  },
  industry:{
    type:String,
    required:true
  },
  hrname:{
    type:String,
    required:true
  },
  hrphno:{
    type:Number,
    required:true
  },
  hremail:{

    type:String,
    required:true
  },
  descp:{
    type:String,
    required:true
  },
  logo:{
    type:String
  },
   isRecruiting: { type: Boolean, default: true }
},{versionKey:false})

export const companymodel=model("company",companyschema)
