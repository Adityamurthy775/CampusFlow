import { Schema,model, trusted } from "mongoose";
 const collegeschema=new Schema({
  name:{
    type:String,
    required:true
  },
  code:{
    type:String,
    required:trusted
  },
  address:{
    type:String,
    required:true
  },
 contact: {
    phone: String,
    email: String,
    website: String
  },
  desp:{
    type:String,
    required:true
  },
  logo:{
    type:String,
    default:""
  }
 },{
  versionKey:false
 })

 export const collegemodel=model("college",collegeschema)
