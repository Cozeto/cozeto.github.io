import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2, Download, Clock } from 'lucide-react';
import { NoteMetadata } from '../types';
import { marked } from 'marked';

interface NoteDetailProps {
  notes: NoteMetadata[];
}

const NoteDetail: React.FC<NoteDetailProps> = ({ notes }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const note = notes.find(n => n.id === id);

  useEffect(() => {
    marked.setOptions({ breaks: true, gfm: true });
  }, []);

  useEffect(() => {
    if (!note) return;

    if (note.type === 'markdown') {
      setLoading(true);
      fetch(note.path)
        .then(res => res.text())
        .then(text => {
          // 移除 Markdown 中的第一个 H1 标题 (# Title)，因为它已经由 Header 组件渲染了
          const cleanMarkdown = text.replace(/^#\s+.*\n?/, '').trim();
          setMarkdown(cleanMarkdown);
          setLoading(false);
        })
        .catch(() => {
          setMarkdown(`# ${note.title}\n\nFailed to load content. Please verify the file exists at ${note.path}.`);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [note]);

  const htmlContent = useMemo(() => (markdown ? marked(markdown) : ''), [markdown]);

  if (!note) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center">
        <h2 className="text-xl font-bold mb-4 tracking-tight text-gray-400">Content Missing</h2>
        <Link to="/" className="text-blue-500 font-bold hover:underline">Back to library</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-black dark:hover:text-white font-bold transition-all text-s"
        >
          <ArrowLeft size={14} />
          BACK
        </button>
      </div>

      <header className="mb-9">
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded text-[12px] font-bold uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold mt-8 mb-8 tracking-tight text-gray-900 dark:text-white leading-[1.2]">
          {note.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] font-bold text-gray-400 border-b border-gray-100 dark:border-gray-800 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <Calendar size={16} className="text-blue-500" />
            {new Date(note.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={16} className="text-blue-500" />
            5 min read
          </span>
          <div className="flex-1"></div>
          <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
            <Share2 size={16} />
            SHARE
          </button>
        </div>
      </header>

      <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
        {note.type === 'markdown' ? (
          <div className="min-h-[40vh] pb-20">
            {loading ? (
               <div className="space-y-4 animate-pulse">
                 <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                 <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6"></div>
               </div>
            ) : (
              <div 
                className="markdown-body leading-relaxed text-base"
                dangerouslySetInnerHTML={{ __html: htmlContent }} 
              />
            )}
          </div>
        ) : (
          <div className="space-y-8 pb-20">
             <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] card-shadow overflow-hidden border border-gray-100 dark:border-gray-800 p-1">
                <iframe 
                  src={note.path} 
                  className="w-full h-[80vh] border-none rounded-[1.3rem]"
                  title={note.title}
                />
             </div>
             <div className="flex justify-center">
               <a 
                href={note.path} 
                download 
                className="flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95 text-xs"
               >
                 <Download size={16} />
                 DOWNLOAD PDF
               </a>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteDetail;
