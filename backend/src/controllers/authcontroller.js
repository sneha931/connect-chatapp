import  User from "../modules/usermodel.js"
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";



export const signup=async(req,res)=>{
    const {email,fullName,password}=req.body;
    try{
        if(!fullName|| !email || !password){
            return res.status(400).json({message:"enter the details in all fields"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }
        const user=await User.findOne({email})
        if(user) return res.status(400).json({message:"Email already exists"});
        const salt=await bcrypt.genSalt(10)
        const hashedpassword=await bcrypt.hash(password,salt)
        const newuser=new User({
            email:email,
            fullName:fullName,
            password:hashedpassword
        })
        if(newuser){
            generateToken(newuser._id,res)
            await newuser.save();

            res.status(201).json({
                _id:newuser._id,
                fullName:newuser.fullName,
                email:newuser.email,
                profilepic:newuser.profilepic,
            });
        }
        else{
            return res.status(400).json({message:"Invalid user data"})
        }
    }
    catch(error){
      console.error("Error in login controller:", err.message);
       res.status(500).json({ message: "Internal server error", error: err.message });
    }
};
export const login=async(req,res)=>{
    const {email,password}=req.body
    try{
     const user=await User.findOne({email});
     if(!user){
        return res.status(400).json({message:"Invalid credentials"});
     }

     const ispassword=await bcrypt.compare(password,user.password)
     if(!ispassword){
        return res.status(400).json({message:"Invalid password"});
     }
     generateToken(user._id,res)

     res.status(200).json({_id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilepic:user.profilepic,
     })
    }
    catch(err){
        console.log("Error in login controller",err.message);
        res.status(500).json({message:"Internal server error",error:err.message})
    }
};
export const logout=async(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out"})
    }
    catch(error){
        console.log("Error in logout controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};
export const updateprofile=async(req,res)=>{
   try{
    const {profilepic}=req.body;
    const userId=req.user._id;
    if(!profilepic){
        return res.status(400).json({message:"profile is required"});
    }
    const uploadresponse=await cloudinary.uploader.upload(profilepic)
    const updateUser=await User.findByIdAndUpdate(userId,{profilepic:uploadresponse.secure_url},{new:true})
    res.status(200).json(updateUser)
   }
   catch(err){
     console.log("error in update profile",err);
     res.status(500).json({message:"Internal server error"})
   }
}
export const checkAuth=async(req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(err){
        console.log("Error in checkauth controller",err.message);
        res.status(500).json({message:"Internal server error"});
    }
}


