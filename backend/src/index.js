import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";


import {connectDB} from "./lib/db.js";




import  authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messageroute.js";
import {app,server} from "./lib/socket.js";

dotenv.config();

const __dirname=path.resolve();


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
   origin: process.env.NODE_ENV === "development" 
      ? "http://localhost:5173" 
      : "https://connect-chatapp-pb6c.onrender.com",
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


const PORT = process.env.PORT ;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
