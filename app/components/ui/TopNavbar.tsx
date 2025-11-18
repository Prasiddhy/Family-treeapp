'use client';

import Link from 'next/link';
import { useTheme } from '@/app/hooks/useTheme';
import { useState } from 'react';
import { Sun, Moon, Settings } from 'lucide-react';
import SettingsModal from '../settings/SettingsModal';

export default function TopNavbar() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 h-14 border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between text-black">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border-2 border-black text-black flex items-center justify-center font-bold">FT</div>
            <Link href="/" className="font-semibold tracking-wide">FamilyTree</Link>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-black hover:underline">Home</Link>
            <Link href="/add-member" className="text-black hover:underline">Add Member</Link>
            {mounted ? (
              <button
                onClick={toggleTheme}
                className="relative p-2 rounded-md border-2 border-black bg-white text-black hover:bg-black hover:text-white transition"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle light/dark mode"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            ) : (
              <div
                className="w-9 h-9 rounded-md border-2 border-dashed border-black opacity-60"
                aria-hidden="true"
              />
            )}
            <button
              onClick={() => setShowSettings(true)}
              className="relative p-2 rounded-md border-2 border-black bg-white text-black hover:bg-black hover:text-white transition"
              title="Settings"
              aria-label="Open settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}


