import { configureStore } from '@reduxjs/toolkit';
import BaseApi from '../BaseQuery/basequery';
import authReducer from '../ApiSlice/Token.slice';
import userReducer from '../ApiSlice/UserData.slice'; 
import chatReducer from '../ApiSlice/Chat.slice'
import channelReducer from '../ApiSlice/ChannelData.slice'
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'; // localStorage


const rootReducer = combineReducers({
  [BaseApi.reducerPath]: BaseApi.reducer,
  auth: authReducer,
  user: userReducer,
  chat: chatReducer,
  channel: channelReducer
});



const persistConfig = {
  key: 'root',
  storage,
  whitelist: [ 'user',"chat","channel"] // choose which slices you want to persist
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