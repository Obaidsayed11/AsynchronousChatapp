// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import mongoose from "mongoose";
// import authRoutes from "./routes/AuthRoutes.js";
// import contactRoutes from "./routes/ContactRoutes.js";
// import setupSocket from "./socket.js";

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;
// const databaseURL = process.env.MONGO_URI;

// app.use(
//   cors({
//     origin: [process.env.ORIGIN],

//     // allow to server to accept request from different origin
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // accepeted methods
//     credentials: true, // allow server to accept cookie matlab yeh enable hoga toh frontend server ke sath cookie share kr payega
//   })
// );

// app.use("/uploads/profiles", express.static("uploads/profiles")); // yeh kya karta haina ki jabh bhi koi user iss route parr req bhejta ha toh to apne directory se assets ko server par bhejega
// app.use(cookieParser()); // yeh cookie lene ke liye fronnted middleware hai
// app.use(express.json()); // yeh body json format mai dene ke liye
// app.use("/api/auth", authRoutes);
// app.use("/api/contacts", contactRoutes);

// const server = app.listen(port, () => {
//   console.log(`server is running on port https://localhost:${port}`); // yeh iss port pe listen karwane ke liye hoa hai srver ko
// });

// setupSocket(server);

// mongoose
//   .connect(databaseURL)
//   .then(() => console.log("DB Connection Successful"))
//   .catch((err) => console.log(err.message));

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import setupSocket from "./Socket.js";

dotenv.config({ path: "./.env" });

connectDB().then(() => {
  const server = app.listen(process.env.PORT, () => {
    console.log(`App listen at ${process.nextTick.PORT}`);// yeh iss port pe listen karwane ke liye hoa hai srver ko
  });

  setupSocket(server);
})
.catch((err)=> {
  console.log("MongoDb connection failed", err);
  
})
