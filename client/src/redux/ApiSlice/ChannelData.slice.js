import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    channels: []
}

const channelDataslice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        addChannel: (state, action) => {
            state.channels = [...state.channels, action.payload]
        },
        setChannel:(state,action)=>{
            state.channels=[action.payload]
        }
    }
})

export const { addChannel,setChannel } = channelDataslice.actions
export default channelDataslice.reducer
