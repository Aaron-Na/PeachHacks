import React, { useState } from 'react';
import axios from 'axios';

interface LoginFormProps {
  onClose: () => void;
  onSuccess: (userData: any) => void;
  onRegisterClick: () => void;
}

export default function LoginForm({ onClose, onSuccess, onRegisterClick }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Login API call
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password
      });
      
      const { token, user } = response.data;
      
      // Save token and user ID to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id.toString());
      
      // Notify parent component
      onSuccess(user);
      
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="absolute inset-0 bg-black opacity-60" onClick={onClose}></div>
      <div className="relative bg-[#1A1A2E] w-full max-w-md rounded-lg border-2 border-[#C0C0C0] shadow-xl backdrop-blur-lg z-10 holographic-card">
        <div className="holographic-overlay"></div>
        <div className="relative z-20 p-6">
          <h2 className="text-2xl text-white pixel-font-bold mb-6 text-center">Login to MusicMate</h2>
          <button 
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/30 border border-red-500 rounded text-white text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-[#00FFFF] mb-2 pixel-body-font">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0E0E1A] border-2 border-[#C0C0C0]/60 rounded-lg py-2 px-4 text-white focus:border-[#FF1493] focus:outline-none"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-[#00FFFF] mb-2 pixel-body-font">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0E0E1A] border-2 border-[#C0C0C0]/60 rounded-lg py-2 px-4 text-white focus:border-[#FF1493] focus:outline-none"
                required
              />
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                className="chrome-orb-button"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              
              <div className="text-center py-3">
                <span className="text-gray-400 pixel-body-font">Don't have an account?</span>
              </div>
              
              <button
                type="button"
                className="chrome-orb-button bg-gradient-to-r from-[#6A0DAD] to-[#00FFFF]"
                onClick={onRegisterClick}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
