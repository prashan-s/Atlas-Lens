import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import CountryPage from './pages/CountryPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx'; // Import FavoritesPage
import PrivateRoute from './components/Auth/PrivateRoute.jsx'; // Import PrivateRoute
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/country/:code" element={<CountryPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Protect the FavoritesPage route with PrivateRoute */}
          <Route 
            path="/favorites" 
            element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
