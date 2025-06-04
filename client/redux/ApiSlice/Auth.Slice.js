import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:300/api/v1",
        credentials: "include",
        prepareHeaders: (headers, { getState}) => {
            headers.set("Accept", "application/json");
            const bearerAccessToken = getState().auth?.token;
            if(bearerAccessToken) {
                headers.set("Authorization" `Bearer ${bearerAccessToken}`);
            }
            return headers;
        }
    })
})