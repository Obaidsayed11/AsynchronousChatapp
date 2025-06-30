import asyncHandler from '../utils/asynchandler.js'
import ApiSuccess from '../utils/ApiScucess.js'
import Message from '../Models/Message.Modal.js'
import fileUpload from '../utils/fileUpload.js'


const GetMessageController = asyncHandler(async (req, res, next) => {
    const user1 = req.user.id
    const user2 = req.body.id

    if (!user1 && !user2) {
        return res.status(400).json(new ApiSuccess(400, [], "Users Id's is Required"))
    }

    const message = await Message.find({
        $or: [
            { sender: user1, recipient: user2 },
            { sender: user2, recipient: user1 }
        ]
    }).sort({ timestamp: 1 })

    if (!message) {
        return res.status(400).json(new ApiSuccess(400, [], "NO Chat was found"))
    }
    return res.status(200).json(new ApiSuccess(200, message, " Chat was found"))



})

const UploadFileController = asyncHandler(async (req, res, next) => {
    const dataFilePath = req?.files?.ImageData[0]?.path
    console.log(dataFilePath, 'file-uplload');

    if (!dataFilePath) {
        return res.json(new ApiSuccess(400, [], "Error occured while uploading file"));
    }

    const dataFileCloudnaryPath=await fileUpload(dataFilePath)
    console.log(dataFileCloudnaryPath?.url,'saibaz');
    if(!dataFileCloudnaryPath){
        return res.json(new ApiSuccess(400, [], "Failed to send file"));
    }

    return res.json(new ApiSuccess(200, dataFileCloudnaryPath?.url, "File upload sucessfully on Cloudnary"));

    




})
export default { GetMessageController, UploadFileController }