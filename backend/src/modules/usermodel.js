const mongoose=require('mongoose')

const userschema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    profilepic:{
        type:String,
        default:"",
    },
},{timestamps:true})

const User=mongoose.model("User",userschema);
module.exports=User;