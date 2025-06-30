import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// import qs from "qs"; 


const BaseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:7000/api/v1",
        credentials: "include", 
        prepareHeaders: (headers, { getState }) => {
            headers.set("Accept", "application/json");
            const bearerAccessToken = getState().auth?.token;
            if (bearerAccessToken) {
                headers.set("Authorization", `Bearer ${bearerAccessToken}`);
            }
            return headers;
        },

        // paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "brackets" }),

       

    }),

    endpoints: () => ({}),
});

export default BaseApi;
