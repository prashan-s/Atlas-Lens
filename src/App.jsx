import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/UI/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CountryPage from './pages/CountryPage';
import FavoritesPage from './pages/FavoritesPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import { useRef } from 'react';

function AppRoutes() {
  const homeSearchHandlerRef = useRef(null);
  const favoritesSearchHandlerRef = useRef(null);
  const location = useLocation();

  // Determine which search handler to use based on the route
  let activeSearchHandlerRef = homeSearchHandlerRef;
  if (location.pathname.startsWith('/favorites')) {
    activeSearchHandlerRef = favoritesSearchHandlerRef;
  }

  const handleNavbarSearch = (query, type) => {
    if (activeSearchHandlerRef.current) {
      activeSearchHandlerRef.current(query, type);
    }
  };

  return (
    <>
      <Navbar onSearch={handleNavbarSearch} />
      <Routes>
        <Route path="/" element={<HomePage onSearchRef={homeSearchHandlerRef} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/country/:code" element={<CountryPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage onSearchRef={favoritesSearchHandlerRef} />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
