import asyncHandler from '../utils/asynchandler.js'
import ApiSuccess from '../utils/ApiScucess.js'
import User from '../Models/User.modal.js'
import Channel from '../Models/Channel.modal.js'
import mongoose from 'mongoose'


export const CreateChannelController = asyncHandler(async (req, res, next) => {

    const { name, members } = req.body
    const userId = req.user.id

    const admin = await User.findById(userId)
    if (!admin) {
        return res.json(new ApiSuccess(400, [], "admin was not found"));
    }

    const validateMembers = await User.find({
        _id: {
            $in: members
        }
    })


    if (validateMembers.length !== members.length) {
        return res.json(new ApiSuccess(400, [], "Some members are not valid"));

    }

    const newChannel = new Channel({
        name,
        members,
        admin: userId
    })


    const channelCreation = await newChannel.save()
    if (!channelCreation) {
        return res.json(new ApiSuccess(400, [], "Failed to create Channel"));
    }

    return res.json(new ApiSuccess(201, channelCreation, "Channel created sucessfully"));

})

export const GetChannelController = asyncHandler(async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id)
    const channels = await Channel.find({
        $or: [{ admin: userId }, { members: userId }]
    }).sort({ updatedAt: -1 }); 

    if (!channels) {
        return res.json(new ApiSuccess(400, [], "Chaneel was not found"));
    }
    return res.json(new ApiSuccess(200, channels, "Chaneel was  found"));


})

export default { CreateChannelController, GetChannelController }