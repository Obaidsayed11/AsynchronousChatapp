import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './Pages/Auth';
import Chat from "./Pages/chat";
import Profile from "./Pages/profile";
import PrivateRoute from "./Pages/PrivateRoute/PrivateRoute";
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

function App() {
    const token = useSelector((state) => state.auth?.token) || Cookies.get('token');
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={token ? <Navigate to="/profile" /> : <Auth />} />

                <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

                <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
