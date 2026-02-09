
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import NoteList from './components/NoteList';
import NoteDetail from './components/NoteDetail';
import Tags from './components/Tags';
import About from './components/About';
import { mockNotes } from './services/contentService';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <HashRouter>
      <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#000000] text-[#f5f5f7]' : 'bg-[#fbfbfd] text-[#1d1d1f]'}`}>
        <Header isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        
        {/* Increased max-width for PC-first wide layout */}
        <main className="max-w-[1600px] mx-auto px-8 pt-32 pb-32">
          <Routes>
            <Route path="/" element={<NoteList notes={mockNotes} />} />
            <Route path="/note/:id" element={<NoteDetail notes={mockNotes} />} />
            <Route path="/tags" element={<Tags notes={mockNotes} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <footer className="border-t border-gray-100 dark:border-gray-900 py-20 px-8">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-sm text-gray-400">
              <p className="font-bold text-gray-900 dark:text-white mb-2 italic text-lg tracking-tight">Cozeto's blog<span className="text-blue-500">.</span></p>
              <p>© 2026 Crafted with precision. Designed for the web.</p>
            </div>
            <nav className="flex gap-10 text-sm font-semibold text-gray-500 dark:text-gray-400">
              <a href="https://github.com/Cozeto" className="hover:text-blue-500 transition-colors">GitHub</a>
            </nav>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
