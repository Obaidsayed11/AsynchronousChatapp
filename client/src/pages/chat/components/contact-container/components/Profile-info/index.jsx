import { Avatar, AvatarImage } from '@/components/ui/avatar'
import React, { useState } from 'react'
import { getColor, colors } from '@/utils/Utils';
import { useSelector } from 'react-redux';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


function ProfileInfo() {
  const data = useSelector((state) => state.user?.data);
  console.log(data.image,"data");
  
  const navigate = useNavigate()

  return (
    <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>

      <div className="flex gap-3 items-center justify-center">
        <div className="w-10 h-10 relative ">
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
        <div className="">
          {data?.firstName && data?.lastName ? ` ${data?.firstName} ${data?.lastName}` : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2 className=' text-purple-700 text-xl font-medium  hover:text-neutral-100 cursor-pointer transit duration-300'  onClick={()=>navigate('/profile')}/>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1ble] border-none mb-2 p-3 text-white">
              Edit profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default ProfileInfo