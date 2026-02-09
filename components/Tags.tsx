
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tag as TagIcon, FileText } from 'lucide-react';
import { NoteMetadata } from '../types';

interface TagsProps {
  notes: NoteMetadata[];
}

const Tags: React.FC<TagsProps> = ({ notes }) => {
  const tagCloud = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach(note => {
      note.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [notes]);

  return (
    <div className="max-w-5xl mx-auto py-12 animate-in fade-in slide-in-from-top-4 duration-700">
      <header className="mb-20 text-center">
        <h1 className="text-6xl font-extrabold tracking-tight mb-6 italic">Taxonomy<span className="text-blue-500">.</span></h1>
        <p className="text-xl text-gray-500 dark:text-gray-400">Browse through {tagCloud.length} unique topics and research areas.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tagCloud.map(([tag, count]) => (
          <Link 
            key={tag} 
            to={`/?query=${tag}`} // Linking to home with a search query or state
            className="group bg-white dark:bg-gray-900 p-8 rounded-[2rem] card-shadow border border-gray-100 dark:border-gray-800 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                <TagIcon size={24} />
              </div>
              <span className="text-4xl font-black text-gray-100 dark:text-gray-800 group-hover:text-blue-500/10 transition-colors">
                {count.toString().padStart(2, '0')}
              </span>
            </div>
            <h3 className="text-2xl font-bold group-hover:text-blue-600 transition-colors mb-2">#{tag}</h3>
            <p className="text-sm text-gray-400 font-medium">Explore entries labeled under this category.</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tags;
