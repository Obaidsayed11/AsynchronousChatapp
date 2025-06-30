import BaseApi from "../BaseQuery/basequery";

export const userApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        userInfo: builder.query({
            query: () => ({
                url: "users/userInfo",
                method: "GET",
            }),
        }),
        profileUpdate: builder.mutation({
            query: (data) => ({
                url: 'users/updateProfile',
                method: "PUT",
                body: data
            })
        }),
    }),
});

export const { useUserInfoQuery,useProfileUpdateMutation } = userApi;
