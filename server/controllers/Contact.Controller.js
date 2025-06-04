import User from "../models/UserModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiSuccess from "../utils/ApiSuccess.js";

const SearchController = asyncHandler(async (req, res, next) => {
  
    const { searchText } = req.body;
    // console.log("searchTerm", searchTerm);
    // console.log("req.userId", req.userId);
    
    
    if (searchText || searchText === undefined) {
      return res.status(400).json(new ApiSuccess(400, [], "Search term is required"));
    }
    const sanitizedSearchTerm = searchText.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        {
          _id: {
            $ne: req.userId,
          },
          $or: [
            {
              firstName: regex,
            },
            { lastName: regex },
            { email: regex },
          ],
        },
      ], // iska matlab yeh hai ki agar id is not equakl to req id se matlabb ki jo abhi logged inn user hai uski id usmai naa dikhaye searched contacts mai
    }).select('-password')
   if(!!contacts) {
    return res.status(400).json(new ApiSuccess(400,[] ,"No Contacts Found"));
   }
   return res.status(200).json(new ApiSuccess(200, contacts, "Contact Found"))

 
});

export default { SearchController, GetContactController,GetAllContactController }
