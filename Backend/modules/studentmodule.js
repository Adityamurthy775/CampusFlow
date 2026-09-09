import { Schema, model } from "mongoose";

const studentschema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },

    skills: {
        type: [String],
        default: []
    },
    cgpa:{
      type:Number,
      required:true
    },
    admissionYear:{
      type:Number
    },
    graduationYear:{
      type:Number
    },
    program:{
      type:String
    },
    linkdinurl:{
      type:String
    },
    githuburl:{
      type:String
    },
    potfoliourl:{
      type:String
    },
    resume:{
      type:String
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, {
    versionKey: false
});

export const studentmodel = model("student", studentschema);
