import BaseApi from "../BaseQuery/basequery";

export const messageApi = BaseApi.injectEndpoints({
    endpoints: (buider) => ({
        getMessage: buider.mutation({
            query: (data) => ({
                url: 'messages/getmessages',
                method: "POST",
                body: data
            })
        }),
        uploadFile: buider.mutation({
            query: (data) => ({
                url: 'messages/uploadfile',
                method: "POST",
                body: data
            })

        })
    })

})

export const { useGetMessageMutation, useUploadFileMutation } = messageApi