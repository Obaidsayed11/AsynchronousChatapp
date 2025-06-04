import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserInfoQuery } from "./services/authApi";
import { setUserInfo, clearUserInfo } from './slice/authSlice.js';
import { addMessage } from "./slice/chatSlice.js";
import { io } from "socket.io-client";
import { HOST } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  const { data, error, isLoading } = useGetUserInfoQuery(undefined, {
    skip: !!userInfo,
  });

  useEffect(() => {
    if (!userInfo && !isLoading) {
      if (error) {
        dispatch(clearUserInfo());
      } else if (data && data.id) {
        dispatch(setUserInfo(data));
      } else {
        dispatch(clearUserInfo());
      }
      setLoading(false);
    } else if (userInfo) {
      setLoading(false);
    }
  }, [userInfo, data, error, isLoading, dispatch]);

  useEffect(() => {
    if (!userInfo?.id) return;

    socketRef.current = io(HOST, {
      query: { userId: userInfo.id },
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      dispatch(addMessage(message));
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userInfo?.id, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
