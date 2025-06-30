import {Router} from "express"
import Contoller from '../Controllers/Auth.controller.js'
import authMiddleware from "../middleare/auth.middleware.js";
import upload from "../middleare/multer.middleware.js";
const { RegisterContoller, LoginController,userInfoController,updateProfileController } = Contoller;

const routers=Router()

const uploadFile=upload.fields([
    {
        name:"profileImage",
        msxCount:1
    }
])

routers.route('/register').post(RegisterContoller);
routers.route('/login').post(LoginController)
routers.route('/userInfo').get(authMiddleware,userInfoController)
routers.route('/updateProfile').put(authMiddleware,uploadFile,updateProfileController)

export default routers