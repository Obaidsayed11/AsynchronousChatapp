import { emptyMessage, setSelectedContact, setSelectedContactType } from '@/redux/ApiSlice/Chat.slice'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { getColor } from '@/utils/Utils';

function ContactList({ contacts, isChannel = false }) {  // Renamed `contact` to `contacts`

  const dispatch = useDispatch();
  const chatData = useSelector((state) => state.chat?.selectedContact);
  const chatDataType = useSelector((state) => state.chat?.selectedContactType);
    const data = useSelector((state) => state.user?.data);


  const handleClick = (contact) => {
    
    dispatch(setSelectedContactType(isChannel ? "channel" : "contact"));
    dispatch(setSelectedContact(contact));

    if (chatData && chatData._id !== contact._id) {
      dispatch(emptyMessage());
    }
  };
  
  



  return (
    <div className='mt-5'>
      {contacts?.flat()?.map((contact) => (
        <div
          key={contact?._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${chatData && chatData?._id === contact?._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"}`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {
              !isChannel ?
                <Avatar className="h-8 w-8  rounded-full overflow-hidden">
                  {contact?.image ? (
                    <AvatarImage src={contact?.image || null} alt="Profile" className="object-cover w-full h-full bg-black" />
                  ) : (
                    <div className={`
                    ${chatData && chatData._id === contact._id ? "bg-[#ffffff22] border border-white/70" : getColor(contact?.setColor)}
                    h-8 w-8 uppercase  text-lg border-[1px] flex items-center justify-center rounded-full `}>
                      {contact?.firstName ? data?.firstName.charAt(0) : "U"}
                    </div>
                  )}
                </Avatar>
                : null
            }
            {
              isChannel ? (
                <div className='bg-[#ffffff22] h-8 w-8  flex items-center justify-center rounded-full'>#</div>
              )
                : null
            }
            {
              isChannel ? (
                <span>{contact?.name}</span>
              )
                : (
                  <span>{`${contact?.firstName} ${contact?.lastName}`}</span>
                )
            }
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactList;
