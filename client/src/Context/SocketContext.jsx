import { addMessage } from '@/redux/ApiSlice/Chat.slice';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef(null);
    const [socketInstance, setSocketInstance] = useState(null); 
    const dispatch = useDispatch();
    
    const userData = useSelector((state) => state.user?.data);
    const contactData = useSelector((state) => state.chat?.selectedContact);
    const contactType = useSelector((state) => state.chat?.selectedContactType);
    const totalMessages = useSelector((state) => state.chat?.messages);
    
    useEffect(() => {
        if (userData && !socket.current) {
            
            socket.current = io("http://localhost:3000", {
                withCredentials: true,
                query: { userId: userData?.id },
            });

            socket.current.on("connect", () => {
                console.log("Connected to Socket");
            });

            const handleReceiveMessage = (message) => {
                
                if (contactType !== undefined && (contactData?.id === message.sender.id || contactData?.id === message.recipient.id)) {
                    dispatch(addMessage(message));
                }
            };

            const handleReceiveChannelMessage=(message)=>{
                
                if(contactType!==undefined && contactData._id===message.channelId){
                    dispatch(addMessage(message));

                }
            }

            socket.current.on('receiveMessage', handleReceiveMessage);
            socket.current.on('receiveChannelMessage', handleReceiveChannelMessage);

            setSocketInstance(socket.current); // ✅ Update state so context gets updated
        }

        return () => {
            if (socket.current) {
                console.log("Disconnecting socket...");
                socket.current.disconnect();
                socket.current = null; // Ensure cleanup
                setSocketInstance(null);
            }
        };
    }, [userData, dispatch, contactData, contactType]);

    return <SocketContext.Provider value={socketInstance}>{children}</SocketContext.Provider>;
};
