
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tag as TagIcon, FileText } from 'lucide-react';
import { NoteMetadata } from '../../types';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4">
        {tagCloud.map(([tag, count]) => (
          <Link 
            key={tag} 
            to={`/?query=${tag}`}
            className="group bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 min-w-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                <TagIcon size={18} />
              </div>
              <h3 className="min-w-0 flex-1 text-base font-bold leading-snug text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors break-words">{tag}</h3>
              <span className="shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-bold text-gray-500 dark:text-gray-400">{count}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tags;
