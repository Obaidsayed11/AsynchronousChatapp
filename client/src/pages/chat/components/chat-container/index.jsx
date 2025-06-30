import React from 'react'
import ChatHeader from './chat-header'
import MessageContainer from './message-container'
import MeaasgeBar from './message-bar'

function ChatContainer() {
  return (
    <div className='fixed top-0 h-[100vh] w-[100vw]  bg-[#1c1d25] flex flex-col md:static md:flex-1 ]'>
      <ChatHeader />
      <MessageContainer />
      <MeaasgeBar />
    </div>
  )
}

export default ChatContainer