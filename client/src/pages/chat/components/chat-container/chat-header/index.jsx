import { closeSelectedContactType } from '@/redux/ApiSlice/Chat.slice'
import React from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { getColor } from '@/utils/Utils';

function ChatHeader() {
  const dispatch = useDispatch()
  const ProfData = useSelector((state) => state.chat?.selectedContact)
  const data = useSelector((state) => state.user?.data);
  const contactType = useSelector((state) => state.chat?.selectedContactType)
  const handleCloseChat = () => {
    dispatch(closeSelectedContactType())
  }
  
  return (
    <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20'>
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className='flex items-center gap-3 cursor-pointer' >
            <div className="w-10 h-10 relative">
              {contactType==="contact"?(<Avatar className="h-10 w-10  rounded-full overflow-hidden">
                {ProfData?.image ? (
                  <AvatarImage src={ProfData?.image || null} alt="Profile" className="object-cover w-full h-full bg-black" />
                ) : (
                  <div className={`h-10 w-10 uppercase  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(ProfData?.setColor)}`}>
                    {ProfData?.firstName ? data?.firstName.charAt(0) : "U"}
                  </div>
                )}
              </Avatar>):(
                <div className='bg-[#ffffff22] h-8 w-8  flex items-center justify-center rounded-full'>#</div>
              )}
            </div>
            <div className="">

              {contactType == 'contact' ?
                ProfData?.firstName && ProfData?.lastName ?
                  ` ${ProfData?.firstName} ${ProfData?.lastName}` : "User"
                : ProfData?.name}</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300'><RiCloseFill className='text-3xl cursor-pointer' onClick={handleCloseChat} /></button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader