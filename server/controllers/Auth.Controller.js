import { compare } from "bcryptjs";

import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiSuccess from "../utils/ApiScucess.js";
import User from "../Models/User.modal.js";
import fileUpload from "../utils/fileUpload.js";

const RegisterContoller = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password is requird");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "User with Email already existed");
  }

  const users = await User.create({
    email,
    password,
  });
  const craetedUsersChecking = await User.findById(users._id);

  if (!craetedUsersChecking) {
    throw new Error("error while creating user");
  }

  return res
    .status(201)
    .json(new ApiSuccess(200, craetedUsersChecking, "registerUserSucesfuly"));
});

const LoginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password is required");
  }

  const existedUser = await User.findOne({
    email,
  });

  if (!existedUser) {
    throw new ApiError(400, "User Doesn't exist");
  }

  const accessTokenGenerate = await existedUser.generateToken();

  const comparePassword = await compare(password, existedUser.password);
  // ismai jo password hai woh jo user deraha hai aur jo user.password hai woh database mai hai matlab compare karega

  if (!comparePassword) {
    throw new ApiError(400, "Password is incorrect");
  }

  const options = {
    https: true,
    secure: true, //cookie secure honi chahiye
    sameSite: "None", // fix cross-site cookie issues
  };

  const loggedInUser = await User.findById(existedUser._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessTokenGenerate, options)
    .json(
      new ApiSuccess(
        200,
        { loggedInUser, accessTokenGenerate },
        "User logged in successfully"
      )
    );
});

const userInfoController = asyncHandler(async (req, res) => {
  const { id } = req.user;
  if (!id) {
    throw new ApiError(400, "User was not found");
  }
  const findUser = await User.findById(id);
  if (!findUser) {
    throw new ApiError(400, "User was not found");
  }

  return res.status(200).json(
    new ApiSuccess(
      200,
      {
        id: findUser.id,
        email: findUser.email,
        profileSetup: findUser.profileSetup,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        image: findUser.image,
        setColor: findUser.setColor,
        profileSetup: findUser.profileSetup,
      },
      {
        findUser,
      },
      "User Find Succesfully"
    )
  );
});

const updateProfileController = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { firstName, lastName, selectedColor } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json(new ApiSuccess(400, "All fields are required"));
  }

  const profileLocalPath = req?.files?.profileImage?.[0]?.path;
  const profilePath = await fileUpload(profileLocalPath);

  if (!profilePath) {
    return res
      .status(400)
      .json(new ApiSuccess(400, "Error occured while uploading file"));
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
  ).select("-password")

    if (!data) {
    return res.status(404).json(new ApiSuccess(404, "User not found"));
  }
 
    return res.status(200).json(new ApiSuccess(200, data, "Profile updated successfully"));

    
  
});

export default { RegisterContoller, LoginController, userInfoController,updateProfileController };
