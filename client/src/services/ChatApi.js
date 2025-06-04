import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HOST, SEARCH_CONTACTS_ROUTES } from "../utils/constants";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: HOST,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    SearchContacts: builder.mutation({
        query: ({ searchTerm }) => ({
          url: SEARCH_CONTACTS_ROUTES,
          method: "POST",
          body: { searchTerm },
        }),
    })
  })



});

export const {
  useSearchContactsMutation
} = chatApi;

