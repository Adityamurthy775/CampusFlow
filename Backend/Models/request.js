import { Schema,Types,model } from "mongoose";

const requestschema=new Schema({
  userinfo:{
    type:Types.ObjectId,
    ref:"user",
    required:true
  },
    catogery: {
    type: String,
    enum: [
      'leave',
      'document_request',
      'fee_related',
      'course_drop',
      'subject_change',
      'project_extension',
      'grievance',
      'other'
    ],
    required: true
  },
  title:{
    type:String,
    required:true
  },
  subject:{
    type:String,
    required:true
  },
  attachments:{
    type:String
  },
  action: { type: String, enum: ['submitted', 'reviewed', 'approved', 'rejected', 'escalated', 'commented'] },
   priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' }
},{versionKey:false})


export const requestmodel=model("request",requestschema)
