

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});


 function getReceiverSocketId(userId){
      return userSocketMap[userId];
 }

const userSocketMap={};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId=socket.handshake.query.userId;
  if(userId) {
    userSocketMap[userId]=socket.id;
    socket.userId=userId;
  }
  io.emit("getOnlineUsers",Object.keys(userSocketMap))


  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (socket.userId) {
      delete userSocketMap[socket.userId];
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
  });
});




module.exports = { app, server, io, getReceiverSocketId };
