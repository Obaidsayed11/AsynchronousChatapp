import { Server as SocketIOServer } from "socket.io";
import Message from "./Models/Message.Modal.js"
import Channel from './Models/Channel.modal.js'


const setUpSocket = (server) => {

    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE"],
        },
    });

    const userSocketMap = new Map(); // Maintain a map of userId -> socketId

    
    const sendMessage = async (message, socket) => {
        
        try {
            const senderSocketId = userSocketMap.get(message.sender);
            const recipientSocketId = userSocketMap.get(message.recipient);
    
            
            const createdMessage = await Message.create(message);
            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName setColor")
                .populate("recipient", "id email firstName lastName setColor");
    
                
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("receiveMessage", messageData);
            }
    
            if (senderSocketId) {
                io.to(senderSocketId).emit("receiveMessage", messageData);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    

    const sendChannelmessage = async (message) => {
        try {
          const { channelId, sender, content, messageType, fileUrl } = message;
      
          // Create the message - remove 'recipient' field if it's not required
          const createdMessage = await Message.create({
            sender,
            content,
            messageType,
            fileUrl,
          });
      
          // Populate sender details
          const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image setColor")
            .exec();
      
          // Add message to channel
          await Channel.findByIdAndUpdate(channelId, {
            $push: {
              message: createdMessage._id,
            },
          });
      
          // Fetch updated channel with members and admins populated
          const channel = await Channel.findById(channelId)
            .populate("members", "_id")
            .populate("admin", "_id");
      
          const finalData = { ...messageData._doc, channelId: channel._id };
      
          // Track already notified socket IDs to avoid duplicate messages
          const notifiedSockets = new Set();
      
          if (channel) {
            // Notify all members
            channel.members.forEach((member) => {
              const socketId = userSocketMap.get(member._id.toString());
              if (socketId && !notifiedSockets.has(socketId)) {
                io.to(socketId).emit("receiveChannelMessage", finalData);
                notifiedSockets.add(socketId);
              }
            });
      
            // Notify all admins
            channel.admin.forEach((adminUser) => {
              const socketId = userSocketMap.get(adminUser._id.toString());
              if (socketId && !notifiedSockets.has(socketId)) {
                io.to(socketId).emit("receiveChannelMessage", finalData);
                notifiedSockets.add(socketId);
              }
            });
          }
        } catch (error) {
          console.log("Error in sendChannelmessage:", error);
        }
      };
      
      

    io.on("connection", (socket) => {
        
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with Socket ID: ${socket.id}`);
        } else {
            console.log("User ID not provided during connection");
        }
        
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
            for (const [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`Removed socket ${socket.id} for user ${userId}`);
                    break;
                }
            }
        });

        socket.on("sendMessage", async (message) => {
            console.log("Received message on server:", message);
            await sendMessage(message, socket)
        });
        socket.on('sendChannelMessage',async(message)=>{
            await sendChannelmessage(message)
        })
    });


};

export default setUpSocket;
