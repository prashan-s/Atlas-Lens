import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 mx-4 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Atlas Lens</span>
          </Link>

          <div className="flex items-center space-x-4">
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
