import { addMessage, setIsDownloading, setIsDownloadingProgress } from '@/redux/ApiSlice/Chat.slice';
import { useGetMessageMutation } from '@/redux/ApiSlice/Message.slice';
import moment from 'moment';
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdFolderZip } from 'react-icons/md'
import { IoMdArrowRoundDown, IoMdClose } from 'react-icons/io'
import { useSocket } from '@/Context/SocketContext';
function MessageContainer() {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const socket = useSocket();

  const chatType = useSelector((state) => state.chat?.selectedContactType);
  const chatData = useSelector((state) => state.chat?.selectedContact);
  const userData = useSelector((state) => state.user?.data);
  const messagesState = useSelector((state) => state.chat?.messages)
  const [selectedChatMessages, setSelectedMessage] = useState([]);
  const [getMessage] = useGetMessageMutation();
  const [showImage, setShowImage] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)





  useEffect(() => {
    const handleGetMessage = async () => {
      if (socket ||chatData?._id && chatType === 'contact') {
        const response = await getMessage({ id: chatData._id });
        setSelectedMessage(response?.data?.data || []);
      }
      else if(chatData?._id && chatType === 'channel'){
        setSelectedMessage(messagesState || []);

      }
    };
    handleGetMessage();
  }, [chatData, chatType, getMessage, messagesState]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' }); // Fix: Correct spelling
    }
  }, [selectedChatMessages]);

  

  const renderMessage = () => {
    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id} className="mb-2">
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format('LL')}
            </div>
          )}
          {chatType === 'contact' ? renderDmMessage(message) : null}
          {chatType === 'channel' ? renderChannelMessage(message) : null}
        </div>
      );
    });
  };

  const checkIfImage = (imagePath) => {
    const imgRegx = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|svg|webp)/
    return imgRegx.test(imagePath)
  }

  const handleDownloadFile = async (fileUrl) => {
    dispatch(setIsDownloading(true));
    dispatch(setIsDownloadingProgress(0));

    try {
      const response = await fetch(fileUrl);

      if (!response.ok || !response.body) {
        throw new Error('Network response was not ok or stream is not readable.');
      }

      const contentLength = response.headers.get('content-length'); //➡️ Server se aayi file ki total size (bytes) nikaal rahe hain.

      if (!contentLength) {
        throw new Error('Content-Length not available in response headers.');
      }

      const total = parseInt(contentLength, 10);

      let loaded = 0;

      //  Stream reader bana rahe hain jo file ko thoda thoda karke read karega.
      // ➡️ chunks me file ke sab parts store karenge.
      const reader = response.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        loaded += value.length;

        // Calculate and dispatch progress percentage
        const progress = Math.round((loaded / total) * 100);
        dispatch(setIsDownloadingProgress(progress));
      }

      // Combine chunks into a blob
      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      dispatch(setIsDownloading(false));
      dispatch(setIsDownloadingProgress(0));


    } catch (error) {
      dispatch(setIsDownloading(false));
      dispatch(setIsDownloadingProgress(0));

      console.error('Download failed:', error);
    }
  };




  const renderDmMessage = (message) => {
     console.log(message,"oiae");
    return (
      <div className={`${message.sender === chatData._id ? 'text-left' : 'text-right'}`}>
        {message.messageType === 'text' ? (
          <div
            className={`${message.sender !== chatData._id
              ? 'bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50'
              : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20'
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        ) : null}
        {message.messageType === 'file' ? (
          <div
            className={`${message.sender !== chatData._id
              ? 'bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50'
              : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20'
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message?.file) ?
              (<div className="cursor-pointer" onClick={() => {
                setImageUrl(message?.file)
                setShowImage(true)
              }
              }>
                <img
                  src={message?.file}
                  alt="Sent image"
                  className="rounded hover:opacity-80 transition duration-200"
                  height={250}
                  width={250}
                  title="Click to download"
                />
              </div>

              )
              : (
                <div className='flex items-center justify-between gap-2 '>
                  <span className='text-white/80 text-3xl bg-black/20 rounded-full p-3'>
                    <MdFolderZip />
                  </span>
                  <span>{message?.file?.split('/').pop().substring(0, 10) + "." + message?.file?.split('/').pop().split('.')[1]}</span>
                  <span className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300' onClick={() => handleDownloadFile(message?.file)}>
                    <IoMdArrowRoundDown />
                  </span>
                </div>
              )}

          </div>
        ) : null}
        <div className="text-xs text-gray-600">{moment(message.timestamp).format('LT')}</div>
      </div>
    );
  };


  const renderChannelMessage = (message) => {
   
    
    return (
      <div className={`mt-5 ${message.sender._id !== userData.id ? "text-left " : "text-right"} `}>
          {message.messageType === 'text' ? (
          <div
            className={`${message.sender._id !== userData._id
              ? 'bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50'
              : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20'
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {selectedChatMessages.length > 0 ? renderMessage() : <p className="text-center text-gray-400">No messages yet</p>}
      <div ref={scrollRef}>
        {
          showImage ? (
            <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex justify-center items-center backdrop-blur-lg">
              <div className="">
                <img src={imageUrl} alt="" className='h-[70vh] w-full bg-cover' />
              </div>
              <div className="flex gap-5 fixed top-0 mt-5">
                <button className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300' onClick={() => handleDownloadFile(imageUrl)}>
                  <IoMdArrowRoundDown />
                </button>
                <button className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300' onClick={() => {
                  setImageUrl(null)
                  setShowImage(false)
                }

                }>
                  <IoMdClose />
                </button>
              </div>
            </div>
          ) : null
        }
      </div>
    </div>
  );
}

export default MessageContainer;
