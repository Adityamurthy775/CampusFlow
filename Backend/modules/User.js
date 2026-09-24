import { Schema,model } from "mongoose";

//create a new schema class
let userschema=new Schema({
  role:{
    type:String,
    enum:["admin","teacher","student","placement-office","hod"],
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
  studentid:{
    type:String
  },
  password:{
    type:String,
    required:true,
    select:false
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
  year:{
    type:Number,
    min:1,
    max:4
  },
  semester:{
    type:Number,
    min:1,
    max:2
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
