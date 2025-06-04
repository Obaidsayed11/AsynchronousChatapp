import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  GET_USER_INFO,
  HOST,
  UPDATE_PROFILE_ROUTE,
  ADD_PROFILE_IMAGE_ROUTE,
  REMOVE_PROFILE_IMAGE_ROUTE,
  LOGOUT_ROUTE,
} from "../utils/constants";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: HOST,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    Login: builder.mutation({
      query: ({ email, password }) => ({
        url: LOGIN_ROUTE,
        method: "POST",
        body: { email, password },
      }),
    }),
    Signup: builder.mutation({
      query: ({ email, password }) => ({
        url: SIGNUP_ROUTE,
        method: "POST",
        body: { email, password },
      }),
    }),
    getUserInfo: builder.query({
      query: () => ({
        url: GET_USER_INFO,
        method: "GET",
      }),
    }),

    UpdateProfile: builder.mutation({
      query: ({ firstName, lastName, color }) => ({
        url: UPDATE_PROFILE_ROUTE,
        method: "POST",
        body: { firstName, lastName, color },
      }),
    }),
    AddProfileImage: builder.mutation({
      query: (formData) => ({
        url: ADD_PROFILE_IMAGE_ROUTE,
        method: "POST",
        body: formData,
      }),
    }),
    RemoveProfileImage: builder.mutation({
      query: ({ image }) => ({
        url: `${REMOVE_PROFILE_IMAGE_ROUTE}?image=${image}`,
        method: "DELETE",
        // responseHandler: "text", // Add this to handle text responses
      }),
      // Add a transform response if needed
    }),
Logout: builder.mutation({
  query: () => ({
    url: LOGOUT_ROUTE,
    method: "POST",
  }),
})

  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetUserInfoQuery,
  useUpdateProfileMutation,
  useAddProfileImageMutation,
  useRemoveProfileImageMutation,
  useLogoutMutation
} = authApi;
