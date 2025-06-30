import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()


app.use(
  cors({
    origin:process.env.ORIGIN    , // Your frontend URL
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"], // Explicitly allow method

  })
);

app.use(express.json({ limit: '16kb' }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: "2mb" }))
app.use(express.static("public"))

import authRoutes from './Routes/Auth.route.js'
import contactRoutes from './Routes/Contact.route.js';
import Messageroutes from './Routes/Message.route.js';
import channelRouter from './Routes/Channel.route.js';


app.use('/api/v1/users',authRoutes)
app.use('/api/v1/contact',contactRoutes)
app.use('/api/v1/messages',Messageroutes)
app.use('/api/v1/channel',channelRouter)


export default app
