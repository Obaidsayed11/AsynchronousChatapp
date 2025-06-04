import { Router } from "express";
import Controller from '../controllers/Auth.Controller.js'
import authMiddleware from "../middlewares/AuthMiddleware.js";
import upload from "../middlewares/multer.middleware.js";
const { RegisterContoller, LoginController,userInfoController,updateProfileController } = Controller;
const routers = Router(); 
const uploadFile = upload.fields([
  {
    name:"profileImage",
    maxCount:1
  }
])


routers.route('/register').post(RegisterContoller);
routers.route('/login').post(LoginController)
routers.route('/userInfo').get(authMiddleware,userInfoController)
routers.route('/updateProfile').put(authMiddleware,uploadFile,updateProfileController)

export default routers