import { Schema,Types,model } from "mongoose";
 const  announcementschema=new Schema({
  coursesinfo:{
    type:Types.ObjectId,
    ref:"courses",
    required:true
  },
  deptinfo:{
    type:Types.ObjectId,
    ref:"dept",
    required:true
  },
  name:{
    type:String,
    required:true
  },
  content:{
    type:String,
    required:true
  },
   priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
   postedby:{
    type:Types.ObjectId,
    ref:"user",
    required:true
   },
   ispinned:{
    type:Boolean,
    default:false
   }
 },{versionKey:false})


 export const announcementmodel=model("announcement",announcementschema )
