import exp from'express'
import {connect,} from "mongoose";
import { userapp } from './Apis/userapi.js';
import { studentapp } from './Apis/studentapi.js';
import { facultyapp } from './Apis/faculty.js';
import { collegeapp } from './Apis/college.js';
import {deptapp} from './Apis/dept.js'
let app=exp();
let port =4000;
//to convert the json structure to js structure
app.use(exp.json())
//redirect to the  apis
app.use("/user-api",userapp)
app.use("/student-api",studentapp)
app.use("/faculty-api",facultyapp)
app.use("/college-api",collegeapp)
app.use("/dept-api",deptapp)
//connection to the database
async function connection() {
  try{
    await connect("mongodb://localhost:27017/campusflow")
    console.log("connection is sucessful")
    app.listen(port,()=>console.log("Database is live"))
  }
  catch(error){
    console.log("Error connecting to the Database ",error)
  }
}
//calling the database connection
connection()


//error handling middleware
app.use((err,req,res,next)=>{
    if(err.name==='ValidationError'){
        return res.status(400).json({message:"errror occured",error:err.stack})
    }
    if(err.name==='CastError'){
        return res.status(400).json({message:"errror occured",error:err.stack})
    }

    //server side error
    res.status(500).json({message:"error occured",error:err.stack})
})
