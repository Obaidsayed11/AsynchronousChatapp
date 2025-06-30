import Cookies from 'js-cookie'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ContactContainer from './components/contact-container'
import EmptyChatConatiner from './components/empty-chat-container'
import ChatContainer from './components/chat-container'
import { useSelector } from 'react-redux'

function Chat() {

  const contactType = useSelector((state) => state.chat?.selectedContactType)
  const navigate = useNavigate()
  const isUploading=useSelector((state)=>state.chat?.isUploading)
  const isDownloading=useSelector((state)=>state.chat?.isDownloading)
  const isUploadingProgress=useSelector((state)=>state.chat?.isUploadingProgress)
  const isDownloadingProgress=useSelector((state)=>state.chat?.isDownloadingProgress)


  useEffect(() => {
    const validate = Cookies.get('profileSetup')
    if (!validate) {
      navigate('/profile')
    }
  }, [])

  return (
    <div className='flex text-white overflow-hidden h-[100vh]'>
      {
        isUploading?(
          <div className=" w-[100vw] h-[100vh] fixed z-10  top-0 left-0  bg-black/80 flex flex-col  justify-center items-center backdrop-blur-md">
            <h5 className="text-5xl animate-pulse">Uploading File</h5>
          {isUploadingProgress}%
          </div>
        ):(
          null
        )
      }
      {
        isDownloading?(
          <div className=" w-[100vw] h-[100vh] fixed z-10  top-0 left-0  bg-black/80 flex flex-col justify-center items-center backdrop-blur-md">
            <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {isDownloadingProgress}%
          </div>
        ):(
          null
        )
      }
      <ContactContainer />
      {!contactType ? (<EmptyChatConatiner />) : (<ChatContainer />)}
      {/* <EmptyChatConatiner/> */}

    </div>

  )
}

export default Chat