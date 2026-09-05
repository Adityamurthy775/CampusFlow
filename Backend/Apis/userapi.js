import exp from "express"
import { usermodel } from "../Models/User.js";
import bcryptjs  from "bcryptjs"
import jwt from "jsonwebtoken"
import multer from "multer"
import path from "path"
import fs from "fs"
export const  userapp=exp.Router();




userapp.post("/register",async(req,res)=>{
  //get the contnet from the req body
  let data=req.body;
  //hash the password
  let hashedpassword=await bcryptjs.hash(data.password,12)
  //replace the password with hassed password
  data.password=hashedpassword
  //create a new document
  let newdoc=new usermodel(data)
  //save the document
   let result= await newdoc.save()

   res.status(200).json({message:"user is created"})

})
userapp.post("/login",async(req,res)=>{
  //get the email id from the req
  let { email, password } = req.body;
  //find the user by email only
  let user=await usermodel.findOne({email:email})
  //check if the user is present
  if(!user){
   return  res.status(404).json({message:"User not found"})
  }
  let result= await bcryptjs.compare(password,user.password)
  if(!result){
    return  res.status(400).json({message:"Incorrect password"})
  }
  const token=jwt.sign({userId:user._id.toString()},jwtSecret,{expiresIn:"1d"});
  const userData=user.toObject();
  delete userData.password;
  res.status(200).json({message:"Login successful",token,payload:userData})

})
/*
userapp.get("/me",authenticate,async(req,res)=>{
  const user=await usermodel.findOne({_id:req.userId,isActive:{$ne:false}}).select("-password")
  if(!user) return res.status(404).json({message:"User not found"})
  res.status(200).json({payload:user})
})

userapp.patch("/me",authenticate,async(req,res)=>{
  const updates={};
  for(const field of profileFields){
    if(req.body[field] !== undefined) updates[field]=req.body[field];
  }
  const user=await usermodel.findOneAndUpdate(
    {_id:req.userId,isActive:{$ne:false}},
    {$set:updates},
    {new:true,runValidators:true}
  ).select("-password")
  if(!user) return res.status(404).json({message:"User not found"})
  res.status(200).json({message:"Profile updated successfully",payload:user})
})

userapp.post("/me/avatar",authenticate,upload.single("avatar"),async(req,res)=>{
  if(!req.file) return res.status(400).json({message:"Avatar image is required"})
  const avatar=`/uploads/${req.file.filename}`;
  const user=await usermodel.findOneAndUpdate(
    {_id:req.userId,isActive:{$ne:false}},
    {$set:{avatar}},
    {new:true}
  ).select("-password")
  if(!user) return res.status(404).json({message:"User not found"})
  res.status(200).json({message:"Avatar uploaded successfully",payload:user})
})*/
//update the user details

userapp.patch("/update/:id",async(req,res)=>{
  //get the updated data from the req
  let newdata=req.body
  //get the user id from the user parameter
  let id=req.params.id
  //hash the password
  let hashpassword=await bcryptjs.hash(newdata.password,12)
  //save the hased password
  newdata.password=hashpassword
  //find the user by the emailid
const user = await usermodel.findByIdAndUpdate(
    id,
    { $set: { ...newdata } },
    { returnDocument: "after",runValidators:true }
);
// User not found
if (!user) {
return res.status(404).json({message: "User not found"});
}

// Send updated user
res.status(200).json({
message: "User updated successfully",payload: user});
})


//soft delete the user by keeping isActive to false

userapp.patch("/delete/:id",async(req,res)=>{
  //get the useer id from the req
  let id=req.params.id
  //find the user and upadet isActive to False
  let result=await usermodel.findByIdAndUpdate(id,
    {$set:{isActive:false}},
    {returnDocument:"after"}
  )
  if(!result){
     return res.status(404).json({message:"user not found"})
  }
  res.status(201).json({message:"user deleted successfully",payload:result})
})

//forgot password
userapp.post("/forgot",async(req,res)=>{
  //get the email id from the body
  const {email,newpassword}=req.body
  //find the user if there then reset the password
  const user=await usermodel.findOneAndUpdate({email:email},
    {$set:{password:newpassword}},
    {returnDocument:"after"}
  )
  //if user is not found
  if(!user){
    return res.status(404).json({message:"user not found"})
  }
  res.status(201).json({message:"password reset successful"})
})
//change password
