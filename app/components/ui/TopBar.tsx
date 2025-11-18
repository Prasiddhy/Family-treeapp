'use client';

import React from 'react';
import { Sun, Moon, Plus } from 'lucide-react';

interface TopBarProps {
  toggleTheme: () => void;
  theme: string;
  setShowAddMember: (val: boolean) => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleTheme, theme, setShowAddMember }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Family Portal</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddMember(true)}
            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition"
            title="Add Member"
          >
            <Plus className="w-5 h-5 text-green-600" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
