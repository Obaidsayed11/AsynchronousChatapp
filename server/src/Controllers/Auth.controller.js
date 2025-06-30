import asyncHandler from '../utils/asynchandler.js'
import ApiError from '../utils/ApiError.js'
import ApiSuccess from '../utils/ApiScucess.js'
import User from '../Models/User.modal.js'
import fileUpload from '../utils/fileUpload.js'

const RegisterContoller = asyncHandler(async (req, res) => {

  const { email, password } = req.body
  if (!email || !password) {
    throw new ApiError(400, "Email and apssword is requird")
  }

  const existedUser = await User.findOne({ email })
  if (existedUser) {
    throw new ApiError(400, "User with Email already existed")
  }

  const users = await User.create({
    email,
    password
  })
  const craetedUsersChecking = await User.findById(users._id)

  if (!craetedUsersChecking) {
    throw new Error("error while creating user");

  }

  return res.status(201).json(
    new ApiSuccess(200, craetedUsersChecking, 'registerUserSucesfuly')
  )

})

const LoginController = asyncHandler(async (req, res) => {

  const { email, password } = req.body
  if (!email || !password) {
    throw new ApiError(400, "Email and apssword is requird")
  }

  const existedUser = await User.findOne({
    email
  })

  if (!existedUser) {
    throw new ApiError(400, "User Dosent exist")

  }


  const accessTokenGenerate = await existedUser.generateToken();

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",  // Fix cross-site cookie issues

  }

  const loggedInUser = await User.findById(existedUser.id).select("-password")

  return res
    .status(200)
    .cookie('accesToken', accessTokenGenerate, options)
    .json(
      new ApiSuccess(
        200,
        {
          user: loggedInUser,
          accessTokenGenerate,
        },
        "User LoggedIn Succesfully"
      )
    )


})

const userInfoController = asyncHandler(async (req, res) => {

  const { id } = req.user
  if (!id) {
    throw new ApiError(400, "User was not Found")
  }
  const findUser = await User.findById(id)
  if (!findUser) {
    throw new ApiError(400, "User was not Found")
  }

  

  return res
    .status(200)
    .json(
      new ApiSuccess(
        200,
        {
          id: findUser.id,
          email:findUser.email,
          profileSerup:findUser.profileSerup,
          firstName:findUser.firstName,
          lastName:findUser.lastName,
          image:findUser.image,
          setColor:findUser.setColor,
          profileSetup:findUser.profileSetup
        },
        {
          findUser
        },
        "User Find Succesfully"
      )
    ) 

})


const updateProfileController = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { firstName, lastName, selectedColor } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json(new ApiSuccess(400, "All fields are required"));
  }

  
  const profileLocalPath = req?.files?.profileImage?.path
  console.log(profileLocalPath);
  
  const profilePath = await fileUpload(profileLocalPath)

  if (!profilePath) {
    return res.status(400).json(new ApiSuccess(400, "Error occured while uploading file"));
  }

  

  
  const data = await User.findByIdAndUpdate(
    id,
    {
      firstName: firstName,
      lastName: lastName,
      setColor: selectedColor,
      profileSetup: true,  
      image:profilePath?.url || null
    },
    { new: true }  // Ensures the updated document is returned
  ).select("-password");

  if (!data) {
    return res.status(404).json(new ApiSuccess(404, "User not found"));
  }

  return res.status(200).json(new ApiSuccess(200, data, "Profile updated successfully"));
});

export default { RegisterContoller, LoginController, userInfoController,updateProfileController };
