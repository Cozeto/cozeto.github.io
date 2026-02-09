
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2, Download, Clock, ChevronRight } from 'lucide-react';
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
      // Simulating fetch
      setTimeout(() => {
        setMarkdown(`
# ${note.title}

Welcome to the detailed view of **${note.title}**. This content area has been expanded to support high-resolution images, complex diagrams, and wide code blocks.

## Why Width Matters in Engineering Blogs

When discussing architectures or code, a narrow 65-character column is often insufficient. By expanding the container to a more generous width, we allow content like the following to breathe:

### 1. Large Architecture Diagrams
![Architecture Diagram](https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2000&auto=format&fit=crop)
*Caption: Visualizing high-scale data pipelines requires horizontal space.*

### 2. Complex Code Structures
\`\`\`javascript
// Wide code blocks are much easier to read without horizontal scrolling
async function deployStaticSiteToGitHubPages(projectRoot, config) {
  const files = await scanDirectory(projectRoot);
  const registry = generateMetadataRegistry(files);
  
  return await Promise.all(files.map(async (file) => {
    const optimizedBuffer = await optimizeAsset(file, config.quality);
    return await uploadToPagesProvider(optimizedBuffer, { path: file.path, version: '1.0.4' });
  }));
}
\`\`\`

### 3. Comprehensive Data Tables
| Feature | Implementation | Performance | Notes |
| :--- | :--- | :--- | :--- |
| **Search** | Fuse.js (Client-side) | O(n * m) | Fast for < 10k items |
| **Rendering** | Marked + Tailwind | Near Instant | SSR ready |
| **Storage** | Flat Files (.md, .pdf) | Zero DB latency | Perfect for Git-ops |

> "Design is the silent ambassador of your brand." — Paul Rand

The balance between readability and space is a fine line. For long-form text, we maintain comfortable line heights and typography, while allowing the container itself to hold wider elements.
        `);
        setLoading(false);
      }, 400);
    } else {
      setLoading(false);
    }
  }, [note]);

  const htmlContent = useMemo(() => marked(markdown), [markdown]);

  if (!note) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Entry Not Found</h2>
        <p className="text-gray-500 mb-8">The content you requested is not available in the current registry.</p>
        <Link to="/" className="px-8 py-3 bg-black text-white rounded-full font-bold transition-transform hover:scale-105 inline-block">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-gray-400 hover:text-black dark:hover:text-white font-semibold transition-all"
        >
          <div className="p-2 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
            <ArrowLeft size={20} />
          </div>
          Return to Library
        </button>
      </div>

      <header className="mb-16">
        <div className="flex flex-wrap gap-2 mb-8">
          {note.tags.map(tag => (
            <Link key={tag} to="/tags" className="px-4 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-xs font-bold tracking-tight border border-blue-100 dark:border-blue-800/20 hover:bg-blue-100 transition-colors">
              {tag}
            </Link>
          ))}
        </div>
        
        <h1 className="text-6xl md:text-7xl font-extrabold mb-10 tracking-tight text-gray-900 dark:text-white leading-[1.05]">
          {note.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-sm font-medium text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-12">
          <span className="flex items-center gap-2.5">
            <Calendar size={20} className="text-blue-500" />
            {new Date(note.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="flex items-center gap-2.5">
            <Clock size={20} className="text-blue-500" />
            7 min read
          </span>
          <div className="flex-1"></div>
          <div className="flex gap-6">
            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors font-bold">
              <Share2 size={18} />
              Share
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors font-bold">
              <Download size={18} />
              Save Offline
            </button>
          </div>
        </div>
      </header>

      <div className="prose prose-2xl prose-gray dark:prose-invert max-w-none">
        {note.type === 'markdown' ? (
          <div className="min-h-[60vh] pb-20">
            {loading ? (
               <div className="space-y-8 animate-pulse max-w-4xl">
                 <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-3/4"></div>
                 <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                 <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6"></div>
                 <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded w-full mt-12"></div>
               </div>
            ) : (
              <div 
                className="markdown-body transition-all duration-500"
                dangerouslySetInnerHTML={{ __html: htmlContent }} 
              />
            )}
          </div>
        ) : (
          <div className="space-y-12 pb-20">
             <div className="bg-white dark:bg-gray-900 rounded-[3rem] card-shadow overflow-hidden border border-gray-100 dark:border-gray-800 p-2">
                <iframe 
                  src={note.path} 
                  className="w-full h-[90vh] border-none rounded-[2.5rem]"
                  title={note.title}
                />
             </div>
             <div className="flex justify-center">
               <a 
                href={note.path} 
                download 
                className="flex items-center gap-4 bg-black dark:bg-white text-white dark:text-black px-12 py-6 rounded-full font-bold shadow-2xl transition-all hover:scale-105 active:scale-95"
               >
                 <Download size={24} />
                 Download Original PDF
               </a>
             </div>
          </div>
        )}
      </div>

      {/* Post-reading suggestions */}
      <footer className="mt-20 pt-20 border-t border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-10">Continue Reading</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {notes.filter(n => n.id !== id).slice(0, 2).map(otherNote => (
             <Link to={`/note/${otherNote.id}`} key={otherNote.id} className="group p-8 bg-gray-50 dark:bg-gray-900 rounded-[2rem] border border-transparent hover:border-blue-500/20 transition-all">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">{otherNote.type}</span>
                <h4 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{otherNote.title}</h4>
                <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
                  Read next <ChevronRight size={16} />
                </div>
             </Link>
           ))}
        </div>
      </footer>
    </div>
  );
};

export default NoteDetail;
