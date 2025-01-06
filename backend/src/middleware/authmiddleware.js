import jwt from "jsonwebtoken";
import  User from "../modules/usermodel.js"

export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt|| req.headers.authorization?.split(" ")[1];
        

        if(!token){
          return res.status(401).json({message:"unauthorized-No token provider"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        
        if(!decoded|| !decoded.userId){
            return res.status(401).json({message:"unauthorized-Invalid token"})
        }
        
        const user= await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        req.user=user;
        next();
       
    }
        catch(err){
           console.log("Error in protectRoute middleware:",err.message);
           res.status(500).json({message:"Internal server error"});
        }
}





