import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import SearchBar from './SearchBar';

export default function Navbar({ onSearch }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Hide SearchBar on /country/*, /login, and /notfound
  const hideSearchBar =
    location.pathname.startsWith('/country') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/notfound');

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 mx-4 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link to="/" className="flex items-center space-x-2 min-w-fit">
            <span className="text-2xl font-bold text-primary">🌍 Atlas Lens</span>
          </Link>

          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-2xl">
              {!hideSearchBar && <SearchBar onSearch={onSearch} />}
            </div>
          </div>

          <div className="flex items-center space-x-4 min-w-fit">
            <Link to="/" className="text-secondary hover:text-primary transition-colors">
              Home
            </Link>
            {currentUser ? (
              <>
                <Link to="/favorites" className="text-secondary hover:text-primary transition-colors">
                  Favorites
                </Link>
                <button
                  onClick={handleLogout}
                  className="button-glass text-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="button-glass text-secondary"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
