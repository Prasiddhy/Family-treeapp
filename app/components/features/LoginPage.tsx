'use client';

import React, { useState } from 'react';

interface LoginPageProps {
  onLoginSuccess: () => void; // callback to navigate to homepage
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Simple validation, in real site connect to backend
    if (username && password) {
      onLoginSuccess();
    } else {
      alert('Please enter username and password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
