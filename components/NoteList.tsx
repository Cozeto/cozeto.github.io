
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Tag, FileText, FileCode, ChevronRight } from 'lucide-react';
import { NoteMetadata } from '../types';
import Fuse from 'fuse.js';

interface NoteListProps {
  notes: NoteMetadata[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [notes]);

  const fuse = useMemo(() => new Fuse(notes, {
    keys: ['title', 'description', 'tags'],
    threshold: 0.35
  }), [notes]);

  const filteredNotes = useMemo(() => {
    let result = searchQuery 
      ? fuse.search(searchQuery).map(r => r.item)
      : notes;

    if (selectedTag) {
      result = result.filter(n => n.tags.includes(selectedTag));
    }

    return [...result].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, selectedTag, fuse, notes]);

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-8">
      {/* Hero / Header Section */}
      <section className="text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="inline-block px-4 py-1.5 mb-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide">
          2026 Collection
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
          Thoughts translated<br /><span className="text-gray-400">into structure.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 font-medium">
          A minimalist space for deep dives into engineering, design, and architecture.
        </p>
      </section>

      {/* Advanced Search Bar */}
      {/* <section className="sticky top-20 z-40 px-4"></section> */}
      <section className="px-4">
        <div className="max-w-3xl mx-auto">
          <div className="search-container relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search by title, tag, or content..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border-none rounded-[2rem] py-6 pl-16 pr-8 shadow-xl shadow-black/[0.03] text-lg focus:ring-0 transition-all outline-none placeholder:text-gray-400"
            />
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setSelectedTag(null)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${!selectedTag ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'}`}
            >
              All Topics
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid of Notes - PC Focused 3-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Link 
              to={`/note/${note.id}`} 
              key={note.id}
              className="group bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 card-shadow flex flex-col h-full border border-gray-100 dark:border-gray-800/50"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-4 rounded-2xl ${note.type === 'markdown' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                    {note.type === 'markdown' ? <FileCode size={28} /> : <FileText size={28} />}
                  </div>
                  <span className="text-xs font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest flex items-center gap-2">
                    {new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold mb-4 leading-snug group-hover:text-blue-600 transition-colors">
                  {note.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 line-clamp-3 mb-8 leading-relaxed">
                  {note.description || "Click to explore this technical deep-dive and research findings."}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex -space-x-1">
                   {note.tags.slice(0, 2).map(tag => (
                     <span key={tag} className="px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 text-[10px] font-bold uppercase rounded-md mr-1 tracking-tighter border border-gray-100 dark:border-gray-700">
                       {tag}
                     </span>
                   ))}
                   {note.tags.length > 2 && <span className="text-[10px] text-gray-400 ml-1">+{note.tags.length - 2}</span>}
                </div>
                <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 flex items-center gap-1 font-bold text-sm">
                  View <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-32 text-center animate-pulse">
            <Search className="mx-auto mb-6 text-gray-200" size={64} />
            <p className="text-2xl font-medium text-gray-400">We couldn't find anything matching that.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteList;
