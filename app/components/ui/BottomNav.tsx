import React from 'react';
import { FaHome, FaTree, FaSearch, FaDna, FaHistory } from 'react-icons/fa';

interface BottomNavProps {
  onSelect: (view: string) => void;
  activeView: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ onSelect, activeView }) => {
  const navItems = [
    { name: "Discover", icon: <FaHome /> },
    { name: "Tree", icon: <FaTree /> },
    { name: "Search", icon: <FaSearch /> },
    { name: "DNA", icon: <FaDna /> },
    { name: "History", icon: <FaHistory /> },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white/90 border-t px-4 py-3 flex items-center justify-center gap-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50 backdrop-blur-sm">
      {navItems.map((item) => {
        const isActive = activeView === item.name.toLowerCase();
        return (
          <button
            key={item.name}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition shadow-sm hover:shadow-md border ${
              isActive ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => onSelect(item.name.toLowerCase())}
          >
            <div className="text-xl">{item.icon}</div>
            <span className="text-xs font-medium">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
