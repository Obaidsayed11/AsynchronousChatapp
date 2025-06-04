import { configureStore } from "@reduxjs/toolkit";
import BaseApi from "../BaseQuery/baseQuery";
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../ApiSlice/Token.slice';
import userReducer from '../ApiSlice/UserData.slice'; 
import chatReducer from '../ApiSlice/Chat.slice'
import channelReducer from '../ApiSlice/ChannelData.slice'
import { persistStore, persistReducer } from 'redux-persist';
//  use karke Redux ka state localStorage me save/retrieve kiya jaata hai (even after page refresh)
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'; // localStorage


const rootReducer = combineReducers({
  [BaseApi.reducerPath]: BaseApi.reducer, // jaise hum createApi use karte the waise hum baseApi.reducer use karenge dnamic form hai uska
  auth: authReducer,
  user: userReducer,
  chat: chatReducer,
  channel: channelReducer
});



const persistConfig = {
  key: 'root',
  storage, // localStorage use ho raha hai
  whitelist: [ 'user',"chat","channel"] // choose which slices you want to persist local storage mai iska naam root.presist hoga
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist needs this
    }).concat(BaseApi.middleware),
});

export const persistor = persistStore(store);
export default store;