import { Schema,Types,model } from "mongoose";

const eventschema=new Schema({
  coursesinfo:{
    type:Types.ObjectId,
    ref:"corses",
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
  decp:{
    type:String,
    required:true
  },
  catogery:{
  type: String,
    enum: ['academic', 'cultural', 'sports', 'placement', 'holiday', 'exam', 'seminar', 'other'],
    required: true
  },
  startdate:{
    type:String,
    required:true
  },
  enddate:{
    type:String,
    required:true
  },
  members:{
    type:Number,
    required:true
  },
  logo:{
    type:String
  }
},{versionKey:false})


export const eventmodel=model("event",eventschema)
