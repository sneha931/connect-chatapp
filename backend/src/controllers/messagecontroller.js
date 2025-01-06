const User = require("../modules/usermodel");
const Message = require("../modules/messagemodel");
const cloudinary = require("cloudinary");
const { getReceiverSocketId,io} = require("../lib/socket");

const getUsersforSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterAndUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filterAndUsers);
  } catch (err) {
    console.log("Error in getUsersforSidebar:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });
    res.status(200).json(messages);
  } catch (err) {
    console.log("Error in getMessages:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
   const receiverSocketId=getReceiverSocketId(receiverId);
   if(receiverSocketId){
    try {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    } catch (socketError) {
      console.log("Error emitting socket event:", socketError.message);
    }
  
   }

    res.status(201).json(newMessage);
  } catch (err) {
    console.log("Error in sendMessage:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUsersforSidebar, getMessages, sendMessage };
