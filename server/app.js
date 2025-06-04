import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

app.use(
    cors({
        origin:process.env.ORIGIN , // ypur frontend url

        // allow to server to accept request from different origin
        methods: ["GET", "POST", "PUT", "DELETE"], // accepeted methods
        credentials: true, // allow server to accept cookie matlab yeh enable hoga toh frontend server ke sath cookie share kr payega
    })
);

app.use(express.json({ limit: '16kb'})) // yeh body json format mai dene ke liye
app.use(cookieParser()) // yeh cookie lene ke liye fronnted middleware hai
app.use(express.urlencoded({ extended: true, limit: "2mb"}))
app.use(express.static("public")) // yeh kya karta haina ki jabh bhi koi user iss route parr req bhejta ha toh to apne directory se assets ko server par bhejega

import authRoutes from './Routes/Auth.route.js'
import contactRoutes from './Routes/Contact.route.js';
import Messageroutes from './Routes/Message.route.js';
import channelRouter from './Routes/Channel.route.js';


app.use('/api/v1/users',authRoutes)
app.use('/api/v1/contact',contactRoutes)
app.use('/api/v1/messages',Messageroutes)
app.use('/api/v1/channel',channelRouter)


export default app