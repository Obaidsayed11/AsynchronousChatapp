import { Router } from "express";
import authMiddleware from "../middleare/auth.middleware.js"
import Controllers from "../Controllers/Message.controller.js";
import upload from "../middleare/multer.middleware.js";


const {GetMessageController,UploadFileController} =Controllers

const Messageroutes=Router()

const uploadFile=upload.fields([
    {
        name:"ImageData",
        maxCount:1
    }
])


Messageroutes.route('/getmessages').post(authMiddleware,GetMessageController)
Messageroutes.route('/uploadfile').post(authMiddleware,uploadFile,UploadFileController)

export default Messageroutes;
