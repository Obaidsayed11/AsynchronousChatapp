import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map(); // kaha se kaha socket connect ho rha hai  // Maintain a map of userId -> socketId

  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        console.log(`Removed socket ${socket.id} for user ${userId}`);
        userSocketMap.delete(userd);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    try {
      console.log("Message being sent:", message);
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);
      const createdMessage = await Message.create(message);

      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", messageData); // ✅ fixed spelling
      }

      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", messageData); // ✅ fixed spelling
      }
      console.log("Sender socket ID:", senderSocketId);
      console.log("Recipient socket ID:", recipientSocketId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("Socket connected", socket.id); // jabh bhi hum socket ko connect karenge tabh hum frontend se userId pass karenge
    if (userId) {
      userSocketMap.set(userId, socket.id); // socket id store karega aur user id store karega
      console.log(`User connected: ${userId} with socket Id: ${socket.id}`);
    } else {
      console.log("User Id no provided during connection");
    }

    socket.on("sendMessage", async (message) => {
      console.log("Received message on server:", message);
      await sendMessage(message, socket);
    });
    
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
  });
};

export default setupSocket;
