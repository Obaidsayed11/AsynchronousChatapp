import BaseApi from "../BaseQuery/basequery";

const ContactApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        searchContact: builder.mutation({
            query: (data) => ({
                url: '/contact/searchcontact',
                method: "POST",
                body: data
            })
        }),
        getContactForDm: builder.query({
            query: () => ({
                url: `/contact/get-contact-for-dm`,
                method: "GET"
            })
        }),
        getAllContacts:builder.query({
            query:()=>({
                url: `/contact/get-all-contact`,
                method: "GET"
            })
        })
    })
});

export const { useSearchContactMutation, useGetContactForDmQuery,useGetAllContactsQuery } = ContactApi;
