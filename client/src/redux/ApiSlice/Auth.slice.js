import BaseApi from "../BaseQuery/basequery";

export const AuthApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (data) => ({
                url: 'users/register',
                method: "POST",
                body: data
            })
        }),
        loginUser: builder.mutation({
            query: (data) => ({
                url: 'users/login',
                method: "POST",
                body: data
            })
        })
    })
});

export const { useRegisterUserMutation, useLoginUserMutation } = AuthApi;
