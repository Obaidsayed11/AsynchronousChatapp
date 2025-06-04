import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

const MessageContainer = () => {
  const scrollRef = useRef();
  const selectedChatType = useSelector((state) => state.chat.selectedChatType);
  const socket = useSelector((state) => state.socket.socket);
  const selectedChatData = useSelector((state) => state.chat.selectedChatData);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const selectedChatMessages = useSelector(
    (state) => state.chat.selectedChatMessages
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };
  

  const renderDMMessages = (message) => (
   <div className={`${message.sender === userInfo.id ? "text-right" : "text-left"}`}>

      {message.messageType === "text" && (
   <div
  className={`${
    message.sender === userInfo.id
      ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 text-right"
      : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 text-left"
  } border inline-block p-4 rounded m-1 max-w-[50%] break-words`}
>
  {message.content}
</div>
    )}
    <div className="text-xs text-gray-600">{
      moment(message.timestamp).format("LT")}</div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[80vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default MessageContainer;
