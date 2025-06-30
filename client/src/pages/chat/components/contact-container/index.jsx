import React, { useEffect } from 'react'
import ProfileInfo from './components/Profile-info';
import NewDm from './components/new-dm';
import { useGetContactForDmQuery } from '@/redux/ApiSlice/ContactSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setDirectMessageForDM } from '@/redux/ApiSlice/Chat.slice';
import ContactList from '@/components/ui/ContactList';
import CreateNewChannel from './components/create-channel';
import { setChannel } from '@/redux/ApiSlice/ChannelData.slice';
import { useGetAllChannelQuery } from '@/redux/ApiSlice/Channel.slice';


function ContactContainer() {
  const dispatch = useDispatch()
  const { data: contacts } = useGetContactForDmQuery(); 
  const { data: channel } = useGetAllChannelQuery(); 
  const dmData = useSelector((state) => state.chat?.getDirectMessageForDm)
  const channelData = useSelector((state) => state.channel?.channels)

  
  
  useEffect(() => {
    if (contacts?.data) {
      dispatch(setDirectMessageForDM(contacts?.data))
    }
    if(contacts?.data){
      dispatch(setChannel(channel?.data))
    }
  }, [channel,contacts])

  

  return (
    <div className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full'>
      <div className="pt-3">
        <Logo></Logo>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct messages" />
          <NewDm />
        </div>
        <div className="max-h-[34vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={dmData || contacts?.data }/>
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="channels" />
          <CreateNewChannel/>
        </div>
        <div className="max-h-[34vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channelData } isChannel={true}/>
        </div>
      </div>
      <ProfileInfo />
    </div>
  )
}

export default ContactContainer

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Chat Bot</span>
    </div>
  );
};


const Title = ({ text }) => {
  return (
    <h6 className='uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm'>{text}</h6>
  )
}