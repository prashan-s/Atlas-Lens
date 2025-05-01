import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/UI/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CountryPage from './pages/CountryPage';
import FavoritesPage from './pages/FavoritesPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import { useRef } from 'react';

function App() {
  // We'll use a ref to store the search handler for HomePage
  const homeSearchHandlerRef = useRef(null);

  // This function will be passed to Navbar and called when searching
  const handleNavbarSearch = (query, type) => {
    if (homeSearchHandlerRef.current) {
      homeSearchHandlerRef.current(query, type);
    }
  };

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Navbar onSearch={handleNavbarSearch} />
          <Routes>
            <Route path="/" element={<HomePage onSearchRef={homeSearchHandlerRef} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/country/:code" element={<CountryPage />} />
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <FavoritesPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
