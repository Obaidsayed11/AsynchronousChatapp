import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store/store.store.js';
import { SocketProvider } from './Context/SocketContext';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from './components/ui/sonner';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <App />
          <Toaster />
        </SocketProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
