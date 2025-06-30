import BaseApi from "../BaseQuery/basequery";

export const channelApi=BaseApi.injectEndpoints({
    endpoints:(builder)=>({
        createChaneel:builder.mutation({
            query:(data)=>({
                url:'/channel/create-channel',
                method:"post",
                body:data
            })
        }),
        getAllChannel:builder.query({
            query:()=>({
                url:'/channel/get-channel',
                method:"GET"
            })
        })
    })
})
export const {useCreateChaneelMutation,useGetAllChannelQuery} = channelApi




