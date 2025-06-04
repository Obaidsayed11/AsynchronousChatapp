import React, { useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../../../../../../components/ui/input";
import Lottie from "react-lottie";
import { animationsDefaultOptions } from "../../../../../../lib/utils";
import { useDispatch } from "react-redux";
import { useSearchContactsMutation } from "../../../../../../services/ChatApi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setUserInfo } from "../../../../../../slice/authSlice";


import { useSelector } from "react-redux";
import { toast } from "sonner";
import { HOST } from "../../../../../../utils/constants";
import { getColor } from "../../../../../../lib/utils";
import {
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
  closeChat,
} from "../../../../../../slice/chatSlice";

const NewDm = () => {
  const selectedChatType = useSelector((state) => state.chat.selectedChatType);
  const selectedChatData = useSelector((state) => state.chat.selectedChatData);
  const selectedChatMessages = useSelector(
    (state) => state.chat.selectedChatMessages
  );
  const userInfo = useSelector((state) => state.auth?.userInfo);
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const closeChat = useSelector((state) => state.chat.closeChat);
  const [searchInput, setSearchInput] = useState("");
  //   const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const [SearchContacts] = useSearchContactsMutation();

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await SearchContacts({ searchTerm }).unwrap();
        // console.log("fggdsg",response.contacts);
        // console.log("fggdsg",response.contacts.length);
        // console.log("response",response);

        if (response.contacts) {
          setSearchedContacts(response.contacts);
        } else if (response.contacts.length === 0) {
          // alert("No contacts found");
          setSearchedContacts([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    dispatch(setSelectedChatType("contact"));
    dispatch(setSelectedChatData(contact));
    setSearchedContacts([]);
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please Select a Contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => {
                const value = e.target.value;
                setSearchInput(value);
                searchContacts(value);
              }}
            />
          </div>
          {searchInput && searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px] ">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectNewContact(contact)}
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt="profile"
                            className="object-cover w-full rounded-full h-full bg-black"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                              contact.color
                            )}`}
                          >
                            {contact.firstName
                              ? contact.firstName.split("").shift()
                              : contact.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {(!searchInput || searchedContacts.length === 0) && (
            <div className="flex-1 md:flex flex-col justify-center items-center duration-1000 transition-all mt-5 md:mt-0">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationsDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">! </span>Search New
                  <span className="text-purple-500"> Contact </span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
