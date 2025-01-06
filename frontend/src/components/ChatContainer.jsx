import React,{useEffect,useRef} from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from "../components/ChatHeader"
import MessageSkeleton from '../skeletons/MessageSkeleton'
import {useAuthStore} from "../store/useAuthStore"
import {formatMessageTime} from "../lib/utils"
import MessageInput from "../components/MessageInput"



function ChatContainer() {
  const {messages,getMessages,isMessagesLoading,selectedUser,subscribe,unsubscribe}=useChatStore();
  const {authUser}=useAuthStore();
  const messageEndRef=useRef(null);

  useEffect(()=>{
    getMessages(selectedUser._id);
    subscribe();
    return () => unsubscribe();
  },[getMessages,selectedUser._id,subscribe,unsubscribe])

  useEffect(()=>{
    if(messageEndRef.current && messages){
      messageEndRef.current.scrollIntoView({behavior:"smooth"});
    }
  },[messages])
  if(isMessagesLoading) {
    return (
      
  <div className='flex-1 flex flex-col overflow-auto'>
    
    <ChatHeader/>
    <MessageSkeleton/>
    <MessageInput/>
    
  </div>
    );
  }
  return (
    <div className='flex-1 flex flex-col overflow-auto w-full max-w-screen-md mx-auto'>
     <ChatHeader>
     </ChatHeader>
     <div className='flex-1 overflow-y-auto p-4 space-y-4'>
      {messages.map((message)=>(
          <div key={message._id}  
          className={`chat ${message.senderId===authUser._id? "chat-end":"chat-start"}`}
          ref={messageEndRef}>
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img src={message.senderId===authUser._id ? authUser.profilepic || "/avatar.png"
                :selectedUser.profilepic|| "/avatar.png"}
                  alt="profile pic"
                />
              </div>
            </div>
            <div className='chat-header mb-1'>
              <time className='text-xs opacity-50 ml-1'>
                {formatMessageTime(message.createdAt)}
              </time>
              </div>
            <div className='chat-content'>
              {message.image && (
                <img src={message.image} alt="Attachement" 
                  className='sm:max-w-[200px] rounded-md mb-2'
                />
              )}
              {message.text && <p>{message.text}</p>}
           
            </div>
          </div>
      ))}
     </div>
     
     <MessageInput/>
    </div>
  )
}

export default ChatContainer
