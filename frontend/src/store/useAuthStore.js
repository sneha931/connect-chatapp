import {create} from "zustand";
import {axiosInstance} from "../lib/axios"
import {toast} from "react-hot-toast"
import {io} from "socket.io-client"

const baseurl=import.meta.env.MODE === "development"?"http://localhost:8000":"/api";

export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingTrue:false,
    isUpdatingProfile:false,
    isCheckingAuth: true,
    onlineUsers:[],
    socket:null,

    checkAuth:async()=>{
        
        try{
          const res=await axiosInstance.get("/auth/check", { withCredentials: true })
          set({authUser:res.data})
          get().connectSocket();
        }
        catch(err){
            console.log("Error in checkAuth:",err);
            set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }
    },
    signup:async(data)=>{
        set({isSigningUp:true});
        try{
           const res=await axiosInstance.post("/auth/signup",data);
           set({authUser:res.data});
           toast.success("Account created")
           get().connectSocket();
        }
        catch(err){
         toast.error(err.response.data.message)
        }
        finally{
            set({isSigningUp:false})
        }
    },
    logout:async()=>{
       try{
        await axiosInstance.post("/auth/logout");
       set({authUser:null});
       toast.success("Logged out succesfully");
       get().disconnectSocket();
       }
       catch(err){
        toast.error("error.response.data.message");
       }
    },
    login:async(data)=>{
        set({isLoggingTrue:true})
        try{
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in succesfully");
            get().connectSocket();
        }
        catch(err){
             toast.error(err.response.data.message);
        }
        finally{
            set({isLoggingTrue:false});
        }
    },
    updateprofile:async(data)=>{
      set({isUpdatingProfile:true});
      try{
        const res=await axiosInstance.put("/auth/update-profile",data);
        set({authUser:res.data});
        toast.success("profile uploded successfully");
      }
      catch(err){
           console.log("error in update profile:",err);
           toast.error(err.response.data.message);
      }
      finally{
        set({isUpdatingProfile:false});
      }
    },
    connectSocket:()=>{
        const {authUser}=get()
        if(!authUser|| get().socket?.connected ) return;
       const socket=io(baseurl,{
        query:{
            userId:authUser._id,
        }
       });
       socket.connect()
       set({socket:socket});
       socket.on("getOnlineUsers",(userIds)=>{
        set({onlineUsers:userIds})
       })
    },
    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect();
        

    }
}))