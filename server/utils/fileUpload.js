import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET 
});

const fileUpload=async(filePath)=>{
    try {
        if (!filePath) return null; 
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto" //ismai cloudinary khud detect karega ki file type kya hai 
        });
        
        fs.unlinkSync(filePath); // jabh woh file upload hojayega toh usko local server se delete kardega unlink
        return response; // upload hone ke baad response mai url public id hota hai return karega

    } catch (error) {
        fs.unlinkSync(filePath); // error ke waqt bhi file delete karo taaki space na le
        return null; 
    }

}

export default fileUpload