import { Schema,Types,model } from "mongoose";

const attendanceschema=new Schema({
  subjectinfo:{
    type:Types.ObjectId,
    ref:"subject",
    required:true
  },
  status: {
  type: String,
  enum: ['present', 'absent', 'late'],
  required: true
  },
})
