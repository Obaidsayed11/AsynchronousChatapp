import { Router } from "express";
import Controller from "../Controllers/Contac.controller.js";
import authMiddleware from "../middleare/auth.middleware.js";


const {SearchController,GetContactController,GetAllContactController} =Controller

const contactRoutes=Router()

contactRoutes.route('/searchcontact').post(authMiddleware,SearchController)
contactRoutes.route('/get-contact-for-dm').get(authMiddleware,GetContactController)
contactRoutes.route('/get-all-contact').get(authMiddleware,GetAllContactController)

export default contactRoutes

