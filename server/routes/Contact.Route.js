import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import Controller from "../controllers/Contact.Controller.js"
import authMiddleware from "../middlewares/AuthMiddleware.js";

const {SearchController,GetContactController,GetAllContactController} =Controller

const contactRoutes = Router();


contactRoutes.route('/searchcontact').post(authMiddleware, SearchController)

export default contactRoutes