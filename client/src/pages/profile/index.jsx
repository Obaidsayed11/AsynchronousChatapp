import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../../slice/authSlice.js";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "../../lib/utils.js";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { colors } from "../../lib/utils.js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useRemoveProfileImageMutation,
  useUpdateProfileMutation,
} from "../../services/authApi.js";
import { useAddProfileImageMutation } from "../../services/authApi.js";
import { HOST } from "../../utils/constants";

const Profile = () => {
  const userInfo = useSelector((state) => state.auth?.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateProfile] = useUpdateProfileMutation();
  const [AddProfileImage] = useAddProfileImageMutation();
  const [RemoveProfileImage] = useRemoveProfileImageMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  // console.log(selectedColor);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
   
    
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await updateProfile({
          firstName,
          lastName,
          color: selectedColor,
        }).unwrap();
        if (response.id) {
          dispatch(setUserInfo(response));
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    console.log("hii");
    const file = event.target.files[0];
    console.log({ file });
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await AddProfileImage(formData).unwrap();

      dispatch(setUserInfo({ userInfo, image: response.image }));
      console.log(image);
      toast.success("Profile image updated successfully");
      setImage(response.image);

      // const reader = new FileReader()
      // reader.omLoad = () => (
      //   setImage(reader.result)
      // )
      // reader.readAsDataURL(file)
    }
  };

  const handleDeleteImage = async () => {
    try {
      console.log("Starting profile image deletion...");
      console.log("Current userInfo.image:", userInfo.image);
      
      const response = await RemoveProfileImage({
        image: userInfo.image
      }).unwrap();
      
      console.log("API Response:", response);
      console.log("Response type:", typeof response);
      
      // Update state after successful API call
      dispatch(setUserInfo({ ...userInfo, image: null }));
      setImage(null);
      console.log("State updated successfully");
      
      // Show success toast
      toast.success("Profile image removed successfully");
      console.log("Success toast should be displayed");
    } catch (error) {
      // Log detailed error information
      console.error("Error removing profile image:", error);
      console.error("Error type:", typeof error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      toast.error("Failed to remove profile image");
      console.log("Error toast displayed");
    }
  };
  {/**
     const handleDeleteImage = async () => {
    try {
    const response = await }
  };
     */}

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10 ">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-col-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png ,.jpg ,.jpeg ,.svg ,.webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none "
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none "
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="LastName"
                type="text"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none "
              />
            </div>
            <div className="w-full flex gap-5 ">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                  ${selectedColor === index ? " outline-white outline-1" : ""}
                  `}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 duration-300 "
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
