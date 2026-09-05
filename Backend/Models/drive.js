import { Schema,Types,model } from "mongoose";

const driveschema=new Schema({
  collegeinfo:{
    type:Types.ObjectId,
    ref:"college",
    required:true
  },
  courseinfo:{
    type:Types.ObjectId,
    ref:"courses",
    required:"true"
  },
  deptinfo:{
    type:Types.ObjectId,
    ref:"dept",
    required:true
  },
  companyinfo:{
    type:Types.ObjectId,
    ref:"company",
    required:true
  },
  name:{
    type:String,
    required:true
  },
  jobType: { type: String, enum: ['full_time', 'internship', 'contract', 'part_time'] },
  descp:{
    type:String,
    required:true
  },
  role:{
    type:String,
    required:true
  },
  loctaion:{
  type:String,
  enum:['virtula','in-office']
  },
  salary:{
    type:Number,
    required:true
  },
  eligibility: {
    minCgpa: { type: Number, default: 0 },
    maxBacklogs: { type: Number, default: 0 },
    allowedDepartments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }],
  },
  stages:[{
    name:{
     type:String,
    enum:[' Application',' Aptitude Test', 'Technical Interview',' HR Interview']
    },
     scheduledDate: Date,
     mode: { type: String, enum: ['online', 'offline', 'hybrid'] },
    venue: String,
    status: { type: String, enum: ['pending', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
  }],
   applicationStart: { type: Date, required: true },
  applicationEnd: { type: Date, required: true },

  status: {
    type: String,
    enum: [ 'open', 'closed', 'in_progress', 'completed', 'cancelled'],
  },
})
