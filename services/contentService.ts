
import { NoteMetadata } from '../types';

/**
 * In a real-world scenario, you would have a build script that scans the 'note/' folder
 * and generates a 'registry.json' file. This file would be used here.
 */

export const mockNotes: NoteMetadata[] = [
  {
    id: 'deep-learning-notes',
    title: 'Modern Deep Learning Architectures',
    date: '2026-01-20',
    tags: ['AI', 'PyTorch', 'Research'],
    description: 'An exploration of transformers, diffusion models and the next frontier of generative AI.',
    type: 'markdown',
    path: '/note/deep-learning.md'
  },
  {
    id: 'transformer-paper',
    title: 'Attention is All You Need',
    date: '2025-12-15',
    tags: ['Paper', 'Classic', 'NLP'],
    description: 'A deep dive into the architecture that changed natural language processing forever.',
    type: 'pdf',
    path: 'https://arxiv.org/pdf/1706.03762.pdf'
  },
  {
    id: 'apple-ui-guidelines',
    title: 'Building Human Interface with React',
    date: '2025-11-05',
    tags: ['Design', 'UX', 'React'],
    description: 'How to implement Apple-style aesthetics using Tailwind CSS and modern React patterns.',
    type: 'markdown',
    path: '/note/design-guide.md'
  },
  {
    id: 'system-design-v2',
    title: 'Distributed Systems & Scalability',
    date: '2025-10-22',
    tags: ['Backend', 'Scalability'],
    description: 'Notes on building reliable, scalable, and maintainable large-scale systems.',
    type: 'markdown',
    path: '/note/system-design.md'
  }
];
