
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
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">
        {tagCloud.map(([tag, count]) => (
          <Link 
            key={tag} 
            to={`/?query=${tag}`}
            className="justify-center group bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 flex-1 min-w-[180px] max-w-[240px]"
          >
            <div className="flex justify-center items-center gap-3 h-full">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                <TagIcon size={18} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{tag}</h3>
              <span className="ml-auto text-sm font-semibold text-gray-400 dark:text-gray-500">{count}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tags;
