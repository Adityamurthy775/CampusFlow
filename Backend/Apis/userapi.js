import exp from "express"
import { usermodel } from "../modules/User.js";
import bcryptjs  from "bcryptjs"
import jwt from "jsonwebtoken"
import multer from "multer"
import path from "path"
import fs from "fs"
import { verifyToken } from "../middleware/verifyToken.js"
export const  userapp=exp.Router();

// JWT secret key (use env variable in production)
const jwtSecret = process.env.JWT_SECRET || "campusflow_super_secret_key_2026";

const isProduction = process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true" || Boolean(process.env.RENDER) || (process.env.CLIENT_ORIGIN && process.env.CLIENT_ORIGIN.includes("https://"));

const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE !== undefined ? process.env.COOKIE_SECURE === "true" : isProduction,
  sameSite: process.env.COOKIE_SAME_SITE || (isProduction ? "none" : "lax"),
  maxAge: 24 * 60 * 60 * 1000
};

if (cookieOptions.sameSite === "none") {
  cookieOptions.secure = true;
}

export function registrationConflict(fields=[]){
  const uniqueFields=[...new Set(fields.map(field=>field==="studentid"?"id":field))];
  if(!uniqueFields.length){
    return {fields:[],message:"Email or Campus ID is already registered"};
  }
  const labels={email:"Email",id:"Campus ID"};
  const names=uniqueFields.map(field=>labels[field] || field);
  return {
    fields:uniqueFields,
    message:`${names.join(" and ")} ${uniqueFields.length===1?"is":"are"} already registered`
  };
}
userapp.post("/register",async(req,res)=>{
  const data={...req.body};
  if(!data.email || !data.password || !data.username || !data.id || !data.role || !data.phno){
    return res.status(400).json({message:"All required fields (role, username, email, id, password, phno) must be provided"})
  }
  if(data.role!=="student"){
    return res.status(403).json({message:"Public registration is limited to student accounts"})
  }
  data.email=String(data.email).trim().toLowerCase();
  data.id=String(data.id).trim();
  data.studentid=data.id;
  const conflicts=[];
  if(await usermodel.exists({email:data.email})) conflicts.push("email");
  if(await usermodel.exists({$or:[{id:data.id},{studentid:data.id}]})) conflicts.push("id");
  if(conflicts.length){
    return res.status(409).json(registrationConflict(conflicts))
  }
  data.password=await bcryptjs.hash(data.password,12);
  try{
    const result=await new usermodel(data).save();
    res.status(201).json({
      message:"User registered successfully",
      payload:{
        id:result._id,
        username:result.username,
        email:result.email,
        role:result.role,
        department:result.department,
        branch:result.branch,
        year:result.year,
        semester:result.semester
      }
    })
  }catch(error){
    if(error.code===11000){
      const fields=Object.keys(error.keyPattern || error.keyValue || {});
      return res.status(409).json(registrationConflict(fields))
    }
    throw error;
  }
})
userapp.post("/login",async(req,res)=>{
  //get the email id from the req
  let { email, password } = req.body;
  email=String(email || "").trim().toLowerCase();
  //validate input
  if(!email || !password){
    return res.status(400).json({message:"Email and password are required"})
  }
  //find the user by email only
  let user=await usermodel.findOne({email:email}).select("+password")
  //check if the user is present
  if(!user){
   return  res.status(404).json({message:"User not found"})
  }
  //check if user is active
  if(user.isActive===false){
    return res.status(403).json({message:"Account is deactivated. Please contact administrator"})
  }
  let result= await bcryptjs.compare(password,user.password)
  if(!result){
    return  res.status(401).json({message:"Invalid credentials"})
  }
  //create JWT token with user info
  const token=jwt.sign(
    {
      userId:user._id.toString(),
      email:user.email,
      username:user.username,
      role:user.role
    },
    jwtSecret,
    {expiresIn:"1d"}
  );

  //Set the token as an HTTP-only cookie for browser clients
  res.cookie("token",token,cookieOptions)

  //remove password from user document
  const userData=user.toObject();
  delete userData.password;
  res.status(200).json({message:"Login successful",payload:userData,token})

})

//// LOGOUT - Clears httpOnly cookie ////
userapp.get("/logout",(req,res)=>{
  //remove the token cookie from the client browser
  res.clearCookie("token",{httpOnly:cookieOptions.httpOnly,secure:cookieOptions.secure,sameSite:cookieOptions.sameSite})
  res.status(200).json({message:"Logout successful"})
})

//// CHECK-AUTH - Verify token and return current user info ////
userapp.get("/check-auth",verifyToken("admin","teacher","student","hod","placement-office"),async(req,res)=>{
  //get user id from the decoded token added by middleware
  const userId=req.userId
  //find the current user
  const user=await usermodel.findById(userId).select("-password")
  //if user not found
  if(!user){
    return res.status(404).json({message:"User not found"})
  }
  res.status(200).json(
    {
      message:"Authenticated",
      payload:{
        id:user._id,
        username:user.username,
        email:user.email,
        role:user.role,
        department:user.department,
        branch:user.branch,
        year:user.year,
        semester:user.semester,
        avatar:user.avatar
      }
    }
  )
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
userapp.patch("/update/:id",verifyToken("admin","teacher","student","hod","placement-office"),async(req,res)=>{
  const id=req.params.id
  if(req.userId!==id && !["admin","hod"].includes(req.role)){
    return res.status(403).json({message:"You are not authorized to update this user"})
  }
  const target=await usermodel.findById(id)
  if(!target) return res.status(404).json({message:"User not found"})
  if(req.role==="hod" && req.userId!==id && ["admin","hod"].includes(target.role)){
    return res.status(403).json({message:"HOD accounts cannot update privileged users"})
  }
  const fields=req.userId===id
    ?["username","phno","department","branch","year","semester","avatar"]
    :req.role==="admin"
      ?["username","email","id","studentid","role","phno","department","branch","year","semester","avatar","isActive"]
      :["username","email","id","studentid","phno","department","branch","year","semester","avatar","isActive"];
  const updates=Object.fromEntries(fields.filter((field)=>req.body[field]!==undefined).map((field)=>[field,req.body[field]]))
  if(!Object.keys(updates).length) return res.status(400).json({message:"No editable profile fields were provided"})
  if(updates.email) updates.email=String(updates.email).trim().toLowerCase()
  if(updates.studentid!==undefined) updates.id=updates.studentid
  if(updates.id!==undefined) updates.studentid=updates.id
  const user=await usermodel.findByIdAndUpdate(
    id,
    {$set:updates},
    {returnDocument:"after",runValidators:true}
  )
  res.status(200).json({message:"User updated successfully",payload:user})
})


userapp.patch("/delete/:id",verifyToken("admin","hod"),async(req,res)=>{
  const id=req.params.id
  if(id===req.userId) return res.status(403).json({message:"You cannot deactivate your own account"})
  const target=await usermodel.findById(id).select("role")
  if(!target) return res.status(404).json({message:"User not found"})
  if(req.role==="hod" && ["admin","hod"].includes(target.role)){
    return res.status(403).json({message:"HOD accounts cannot deactivate privileged users"})
  }
  const result=await usermodel.findByIdAndUpdate(
    id,
    {$set:{isActive:false}},
    {returnDocument:"after"}
  )
  res.status(200).json({message:"User deactivated successfully",payload:result})
})

userapp.post("/forgot",async(req,res)=>{
  res.status(410).json({message:"Direct password reset is disabled. Use the authenticated change-password flow or an administrator-managed reset."})
})
//change password (protected: only self can change password)
userapp.post("/change-password/:id",verifyToken("admin","teacher","student","hod","placement-office"),async(req,res)=>{
  //get the id, current password and new password
  const id=req.params.id
  const {currentPassword,newPassword}=req.body
  //check if the requesting user is allowed to change password for this user (only self)
  if(req.userId !==id){
    return res.status(403).json({message:"You are not authorized to change password for this user"})
  }
  //validate input
  if(!currentPassword || !newPassword){
    return res.status(400).json({message:"Current password and new password are required"})
  }
  //find the user by id
  const user=await usermodel.findById(id).select("+password")
  if(!user){
    return res.status(404).json({message:"User not found"})
  }
  //verify the current password
  const isMatch=await bcryptjs.compare(currentPassword,user.password)
  if(!isMatch){
    return res.status(401).json({message:"Current password is incorrect"})
  }
  //hash the new password and update
  const hashedPassword=await bcryptjs.hash(newPassword,12)
  await usermodel.findByIdAndUpdate(id,{$set:{password:hashedPassword}})
  res.status(200).json({message:"Password changed successfully"})
})
userapp.get("/all",verifyToken("admin","teacher","student","hod","placement-office"),async(req,res)=>{
  const filter={isActive:{$ne:false}}
  if(req.role==="student") filter._id=req.userId
  if(req.role==="placement-office") filter.role="student"
  if(req.role==="teacher") filter.role={$in:["student","teacher"]}
  const users=await usermodel.find(filter).select("username email id role department branch year semester isActive")
  res.status(200).json({message:"Users fetched successfully",payload:users})
})
