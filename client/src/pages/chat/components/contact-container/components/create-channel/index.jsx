import React, { useEffect, useState } from 'react'

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
import { useGetAllContactsQuery } from '@/redux/ApiSlice/ContactSlice'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import MultipleSelector from '@/components/ui/mutipleselect'
import { useCreateChaneelMutation } from '@/redux/ApiSlice/Channel.slice'
import { addChannel } from '@/redux/ApiSlice/ChannelData.slice'


function CreateNewChannel() {
  const [openNewChannelModal, setOpenNewChannelModal] = useState(false)
  const [allContacts,setAllContacts]=useState([])
  const[selectedContact,setSelectedContact]=useState([])
  const[channelName,setChannelName]=useState("")
  const dispatch=useDispatch()
  const { data: Contacts } = useGetAllContactsQuery(); 

  const [createChannelApi] =useCreateChaneelMutation()

  
  useEffect(()=>{
    setAllContacts(Contacts?.data)
  },[])

  const createChannel=async()=>{
    const respone= await createChannelApi({
      name:channelName,
      members:selectedContact?.map((item)=>item.value)
    })
    
    if(respone?.data?.statusCode==201){

      
      setChannelName("")
      setSelectedContact([])
      setOpenNewChannelModal(false)
      dispatch(addChannel(respone?.data?.data))

    }
    
  }




  


  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus className='text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transit duration-300' onClick={() => setOpenNewChannelModal(true)} />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1ble] border-none mb-2 p-3 text-white">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewChannelModal} onOpenChange={setOpenNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle> Please Fill up the details for New Channel.</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input placeholder="Channel Name" className="rounded-lg p-6 bg-[#2c2e3b] border-none" onChange={(e) => setChannelName(e.target.value)} value={channelName}></Input>
          </div>
          <div className="">
            <MultipleSelector className="rounded-lg bg-[#2c2e3e] border-none py-2 text-white" defaultOptions={allContacts} placeholder="Search Contact" value={selectedContact} onChange={setSelectedContact} />
            
          </div>
          <div className="">
            <Button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={createChannel}> Create Channel</Button>
          </div>
          
         
        </DialogContent>
      </Dialog>


    </div>
  )
}

export default CreateNewChannel