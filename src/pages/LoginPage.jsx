import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="glass w-full max-w-md p-8 border border-white/40 shadow-2xl rounded-2xl backdrop-blur-md">
        <div className="flex flex-col items-center mb-4">
          <FaUserCircle className="text-5xl text-primary mb-2 drop-shadow" />
          <h2 className="text-2xl font-bold text-center text-secondary mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            {isLogin ? 'Sign in to continue to Atlas Lens' : 'Join Atlas Lens to get started!'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="input-glass w-full py-3 px-4 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input-glass w-full py-3 px-4 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button-glass w-full text-secondary bg-primary/90 hover:bg-primary text-white font-semibold py-3 rounded-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
