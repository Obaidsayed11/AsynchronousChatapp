import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import setUpSocket from "./Socket.js";


dotenv.config({ path: "./.env" });


connectDB()
.then(()=>{
 const server= app.listen(process.env.PORT,()=>{
    console.log(`App listen at ${process.env.PORT}`)
  })
  setUpSocket(server)
})
.catch((err)=>{
  console.log("Mondodb connection failed ",err)
})

