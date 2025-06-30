import React, { useState } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FaPlus } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { animationDefaultOptions } from '@/utils/Utils'
import Lottie from 'react-lottie'
import { useSearchContactMutation } from '@/redux/ApiSlice/ContactSlice'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { getColor } from '@/utils/Utils';
import { useDispatch } from 'react-redux'
import { setSelectedContact,setSelectedContactType } from '@/redux/ApiSlice/Chat.slice'







function NewDm() {
  const [openNewContactModal, setOpenNewContactModal] = useState(false)
  const [searchContacts, setSearchContacts] = useState([])
  const [SearchContact] = useSearchContactMutation();
  const dispatch=useDispatch()

  

  let searchTimeout;

  const handleSearchContact = (searchText) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout); // Clear previous timeout
    }

    if (searchText) {
      searchTimeout = setTimeout(async () => {
        const data = { searchText: searchText };
        try {
          const response = await SearchContact(data);
          setSearchContacts(response?.data?.data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      }, 600);
    } else {
      setSearchContacts([]);
    }

  };


  const handleSelectNewContact=async(data)=>{
    setOpenNewContactModal(false)
    setSearchContacts([])
    dispatch(setSelectedContact(data))
    dispatch(setSelectedContactType('contact'))
    
    
  }


  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus className='text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transit duration-300' onClick={() => setOpenNewContactModal(true)} />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1ble] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle> Please select a Contact.</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input placeholder="Search Contact" className="rounded-lg p-6 bg-[#2c2e3b] border-none" onChange={(e) => handleSearchContact(e.target.value)}></Input>
          </div>
          <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {searchContacts?.map((data, index) => {
                return (
                  <div className='flex items-center gap-3 cursor-pointer' key={data.id} onClick={()=>handleSelectNewContact(data)}>
                    <div className="w-10 h-10 relative">
                      <Avatar className="h-10 w-10  rounded-full overflow-hidden">
                        {data?.image ? (
                          <AvatarImage src={data?.image || null} alt="Profile" className="object-cover w-full h-full bg-black" />
                        ) : (
                          <div className={`h-10 w-10 uppercase  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(data?.setColor)}`}>
                            {data?.firstName ? data?.firstName.charAt(0) : "U"}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>{data?.firstName && data?.lastName ? ` ${data?.firstName} ${data?.lastName}` : "User"}</span>
                      <span className='text-xs'>{data?.email ? ` ${data?.email} ` : ""}</span>

                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
          {
            searchContacts && searchContacts.length <= 0 ?
              <div className='flex-1  md:flex flex-col justify-center items-center  duration-1000 transition-all'>
                <Lottie isClickToPauseDisabled={true} height={120} width={120} options={animationDefaultOptions} />
                <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-2 lg:text-2xl text-xl transition-all dura-30 text-center">
                  <h3 className='poppins-medium mt-8'>
                    Hi <span className='text-red-800'>!</span> Saerch New
                    <span className='text-red-800'> Contacts </span>
                  </h3>
                </div>
              </div> : null
          }
        </DialogContent>
      </Dialog>


    </div>
  )
}

export default NewDm