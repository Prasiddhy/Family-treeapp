'use client';

import { useState, FormEvent } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { user, login, loading } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const success = await login(credentials.username.trim(), credentials.password.trim());
    if (!success) {
      setError('Invalid credentials. Use username "family" and password "family".');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-3xl border-2 border-black bg-white p-8 shadow-2xl space-y-5"
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <Lock className="h-10 w-10" />
            <h1 className="text-2xl font-semibold">Family Login</h1>
            <p className="text-sm text-black/70">Enter the shared credentials to open your dashboard.</p>
          </div>

          <label className="text-xs font-semibold uppercase tracking-wide">Username</label>
          <input
            value={credentials.username}
            onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            className="w-full rounded-xl border border-black/40 px-4 py-2 text-sm"
            placeholder="family"
            autoComplete="username"
          />

           <label className="text-xs font-semibold uppercase tracking-wide">Password</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-xl border border-black/40 px-4 py-2 text-sm"
            placeholder="family"
            autoComplete="current-password"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border-2 border-black bg-black py-2 text-sm font-semibold text-white transition disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Enter Dashboard'}
          </button>
          <p className="text-[11px] text-center text-black/60">Username: family · Password: family</p>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}

