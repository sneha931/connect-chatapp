import {create} from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore=create((set,get)=>({
    users:[],
    messages:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoding:false,

    getUsers:async()=>{
        set({isUsersLoding:true});
        try{
            const res=await axiosInstance.get("/message/users");
            set({users:res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isUsersLoading:false});
        }
    },
    getMessages:async(userId)=>{
        set({isMessagesLoding:true});
        try{
            const res=await axiosInstance.get(`/message/${userId}`);
            set({messages:res.data})
        }
        catch(err){
            toast.error(error.response.data.message);
        }
        finally{
            set({isMessagesLoding:false})
        }
    },
    sendMessage:async(msgdata)=>{
        const {selectedUser,messages}=get()
        try{
            const res=await axiosInstance.post(`/message/send/${selectedUser._id}`,msgdata);
            set({messages:[...messages,res.data]})
        }
        catch(err){
            toast.error(error.response.data.message);
        }
    },
    subscribe:()=>{
      const {selectedUser}= get()
      if(!selectedUser) return;
      const socket=useAuthStore.getState().socket;
      socket.on("newMessage",(newMessage)=>{
        if(newMessage.senderId !== selectedUser._id) return;
        set({messages:[...get().messages,newMessage],})
      })
    },
    unsubscribe:()=>{
       const socket=useAuthStore.getState().socket;
       socket.off("newMessage");
    },
    setSelectedUser:async(selectedUser) => set({selectedUser}),
    
}))