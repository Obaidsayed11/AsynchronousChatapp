import { Router } from "express";
import Contoller from '../Controllers/Channel.controller.js'
import authMiddleware from "../middleare/auth.middleware.js";

const { CreateChannelController,GetChannelController } = Contoller
const channelRouter = Router()

channelRouter.route('/create-channel').post(authMiddleware, CreateChannelController)
channelRouter.route('/get-channel').get(authMiddleware, GetChannelController)


export default channelRouter