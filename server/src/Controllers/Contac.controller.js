import asyncHandler from '../utils/asynchandler.js'
import ApiSuccess from '../utils/ApiScucess.js'
import User from '../Models/User.modal.js'
import mongoose from 'mongoose'
import Message from '../Models/Message.Modal.js'

const SearchController = asyncHandler(async (req, res) => {
    const { searchText } = req.body


    if (!searchText || searchText === undefined) {
        return res.status(400).json(new ApiSuccess(400, [], "SerachItem is Required"))
    }

    const snatizedSearchItem = searchText.replace(
        /[.*=?${}()|[\]\\]/g, "\\$&"
    )

    const regex = new RegExp(snatizedSearchItem, "i")
    const contacts = await User.find({
        $and: [
            { _id: { $ne: req.user.id } },
            {
                $or: [
                    { firstName: regex }, { lastName: regex }, { email: regex }
                ]
            }
        ]
    }).select('-password')

    if (!contacts) {
        return res.status(400).json(new ApiSuccess(400, [], "No Contact Found"))
    }
    return res.status(200).json(new ApiSuccess(200, contacts, "Contact Found"))

})

const GetContactController = asyncHandler(async (req, res, next) => {
    try {
        let userId = req.user.id;

        // Convert userId to ObjectId if it's a string
        if (typeof userId === "string") {
            userId = new mongoose.Types.ObjectId(userId);
        }


        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { recipient: userId }
                    ]
                }
            },
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            { $unwind: "$contactInfo" },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                }
            },
            { $sort: { lastMessageTime: -1 } }
        ]);


        return res.status(200).json(new ApiSuccess(200, contacts, "Contact is found"));
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
})

const GetAllContactController = asyncHandler(async (req, res) => {
    const id = req.user.id

    const contacts=await User.find({
        _id:{
            $ne:id
        }
    },"firstName lastName _id email")
   
    if (!contacts) {
        return res.status(400).json(new ApiSuccess(400, [], "No Contact Found"))
    }

    const contactData=contacts?.map((data)=>({
        label:data.firstName ? `${data?.firstName} ${data?.lastName}`: data?.email,
        value:data?._id
    }))

    return res.status(200).json(new ApiSuccess(200, contactData, "Contact Found"))

})

export default { SearchController, GetContactController,GetAllContactController }