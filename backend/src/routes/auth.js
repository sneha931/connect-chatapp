const express=require('express');
const router=express.Router();
const {login,signup,logout,updateprofile,checkAuth} =require( "../controllers/authcontroller.js");

const protectRoute=require("../middleware/authmiddleware.js")
router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateprofile);
router.get("/check",protectRoute,checkAuth)
module.exports=router;