import mongoose from "mongoose";
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("database connected");
    }
    catch(error){
        console.log("database not connected",error);
    }
}
export default connectDB;
