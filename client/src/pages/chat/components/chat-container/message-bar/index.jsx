import React, { useEffect, useRef, useState } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { IoMdSend } from 'react-icons/io';
import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../../../../Context/SocketContext';
import { useUploadFileMutation } from '@/redux/ApiSlice/Message.slice';
import { setIsUploading, setIsUploadingProgress } from '@/redux/ApiSlice/Chat.slice';

function MessageBar() {
  const emojiRef = useRef();
  const fileRef = useRef()
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch()

  const contactType = useSelector((state) => state.chat?.selectedContactType);
  const contactData = useSelector((state) => state.chat?.selectedContact);
  const userData = useSelector((state) => state.user?.data);
  const [uploadFiles] = useUploadFileMutation()
  const socket = useSocket()


  
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };




  const handleSendMessage = async () => {
    if (contactType === "contact" && socket) {
      try {
        const messageData = {
          sender: userData?.id,
          content: message,
          recipient: contactData?._id,
          messageType: "text",
          file: undefined,
        }
        console.log(messageData,"message");
        
        socket.emit("sendMessage", messageData);
        setMessage("")

      } catch (error) {
        console.error(" Error emitting message:", error);
      }
    }
    else if(contactType==="channel" && socket){
      
      try {
        const messageData = {
          sender: userData?.id,
          content: message,
          messageType: "text",
          file: undefined,
          channelId:contactData?._id
        }
        socket.emit('sendChannelMessage',messageData)
        setMessage("")

      } catch (error) {
        console.error(" Error emitting message:", error);
        
      }

    }
  };

  const handleAttachmentClick = () => {
    if (fileRef.current) {
      fileRef.current.click()
    }
  }

  const handleAttachmentChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append("ImageData", file)
      dispatch(setIsUploading(true))
      const response = await uploadFiles(formData)

      if (response?.data.statusCode === 200 && response.data.data) {
        dispatch(setIsUploading(false))

        if (contactType === 'contact') {
          try {
            const messageData = {
              sender: userData?.id,
              content: undefined,
              recipient: contactData?._id,
              messageType: "file",
              file: response?.data?.data,
            }
            socket.emit("sendMessage", messageData);
            setMessage("")

          } catch (error) {
            dispatch(setIsUploading(false))
            console.error(" Error emitting message:", error);
          }
        }
      }

      else if(contactType==="channel"){
        try {
          const messageData = {
            sender: userData?.id,
            content: undefined,
            channel: contactData?._id,
            messageType: "file",
            file: response?.data?.data,
          }
          socket.emit("sendChannelMessage", messageData);
          setMessage("")

        } catch (error) {
          dispatch(setIsUploading(false))
          console.error(" Error emitting message:", error);
        }
      }

    }

  }

  return (
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-8 gap-6'>
      <div className="flex-1 flex bg-[#282b33] rounded-md items-center gap-5 pr-5">
        <input type="text" className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none' placeholder='Enter Message....' value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className='text-neutral-500 cursor-pointer' onClick={handleAttachmentClick}><GrAttachment className='text-2xl' /></button>
        <input type="file" className='hidden' ref={fileRef} onChange={handleAttachmentChange} />
        <div className="relative">
          <button className='text-neutral-500 cursor-pointer' onClick={() => setEmojiPicker(!emojiPicker)}><RiEmojiStickerLine className='text-2xl' /></button>
          {emojiPicker && <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker theme='dark' open={emojiPicker} onEmojiClick={handleAddEmoji} />
          </div>}
        </div>
      </div>
      <button className='bg-[#8417ff] rounded-md p-5' onClick={handleSendMessage}><IoMdSend className='text-2xl' /></button>
    </div>
  );
}

export default MessageBar;
