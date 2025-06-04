import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import ContactsContainer from './components/contacts-container';
import EmptyChatContainer from './components/empty-chat-container';
import ChatContainer from './components/chat-container';

const Chat = () => {

  const userInfo = useSelector((state) => state.auth.userInfo);
 const selectedChatType = useSelector((state) => state.chat.selectedChatType);
 console.log("selectedChatType",selectedChatType);
 

  const navigate = useNavigate();

  useEffect(() => {
   if (!userInfo.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
   }
  },[userInfo, navigate]);
  return (
    <div className='flex h-[100vh] text-white outline-hidden'>
      <ContactsContainer />
      {
        selectedChatType === undefined ? (<EmptyChatContainer />) : (<ChatContainer />)
      }
      {/* <EmptyChatContainer /> */}
      {/* <ChatContainer /> */}
    </div>
  )
}

export default Chat