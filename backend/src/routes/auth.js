import express from "express";
const router=express.Router();
import {login,signup,logout,updateprofile,checkAuth} from "../controllers/authcontroller.js";

import  {protectRoute} from "../middleware/authmiddleware.js";
router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateprofile);
router.get("/check",protectRoute,checkAuth)
export default router;
