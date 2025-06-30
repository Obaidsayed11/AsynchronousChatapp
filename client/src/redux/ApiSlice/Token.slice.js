import { createSlice } from '@reduxjs/toolkit';
import Cookies from "js-cookie";

const initialState = {
    token: Cookies.get('accessToken') || null, // Retrieve token from cookies
    data: {} // Ensure data is always an object
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        LoginSetToken: (state, action) => {
            state.token = Cookies.get('accessToken') || action.payload?.token || null; 
            state.data = action.payload?.data || {}; // Ensure data is always an object
        },
        logoutResetToken: (state) => {
            state.token = null;
            state.data = {};
            Cookies.remove('token')
        },
    },
});

export const { LoginSetToken, logoutResetToken } = authSlice.actions;
export default authSlice.reducer;
