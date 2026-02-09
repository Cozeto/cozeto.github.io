
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Home, Tag, User } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleDarkMode }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Tags', path: '/tags', icon: <Tag size={18} /> },
    { name: 'About', path: '/about', icon: <User size={18} /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 apple-blur border-b border-gray-200/50 dark:border-gray-800/50 h-14">
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          Insights<span className="text-blue-500">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 transition-colors ${
                location.pathname === item.path 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
