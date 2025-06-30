import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedContact: undefined,
    selectedContactType: undefined,
    messages: [],
    getDirectMessageForDm:[],
    isUploading:false,
    isDownloading:false,
    isUploadingProgress:0,
    isDownloadingProgress:0,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedContact: (state, action) => {
            state.selectedContact = action.payload;
        },
        setSelectedContactType: (state, action) => {
            state.selectedContactType = action.payload;
        },
        closeSelectedContactType: (state) => {
            state.selectedContactType = undefined;
        },
        emptyMessage:(state)=>{
            state.messages=[]
        },
        addMessage: (state, action) => {
            
            state.messages = [
                ...state.messages,
                {
                    ...action.payload,
                    recipient:
                        state.selectedContactType === "channel"
                            ? action.payload.recipient
                            : action.payload.recipient?.id,
                    sender:
                    state.selectedContactType === "channel"
                            ? action.payload.sender
                            : action.payload.sender?._id,
                },
            ];
        },
        setDirectMessageForDM:(state,action)=>{
            state.getDirectMessageForDm=[action.payload]
        },
        setIsUploading:(state,action)=>{
            state.isUploading=action.payload
        },
        setIsDownloading:(state,action)=>{
            state.isDownloading=action.payload
        },
        setIsUploadingProgress:(state,action)=>{
            state.isUploadingProgress=action.payload
        },
        setIsDownloadingProgress:(state,action)=>{
            state.isDownloadingProgress=action.payload
        },


    },
});

export const { setSelectedContact, setSelectedContactType, closeSelectedContactType, addMessage,setDirectMessageForDM,setIsUploading,setIsDownloading,setIsUploadingProgress,setIsDownloadingProgress,emptyMessage } = chatSlice.actions;
export default chatSlice.reducer;
