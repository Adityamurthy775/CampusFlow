import { Schema,model } from "mongoose";

//create a new schema class
let userschema=new Schema({
  role:{
    type:String,
    enum:["teacher","student","placement-office","hod"],
    required:true
  },
  username:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  id:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  phno:{
    type:Number,
    required:true
  },
  department:{
    type:String,
  },
  branch:{
    type:String

  },
  avatar:{
    type:String
  },
  isActive:{
    type:Boolean,
    default:true
  }
},{
  versionKey:false
})

export const usermodel=model("user",userschema)
