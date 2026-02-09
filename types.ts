
export type NoteType = 'markdown' | 'pdf';

export interface NoteMetadata {
  id: string;
  title: string;
  date: string;
  tags: string[];
  description?: string;
  type: NoteType;
  path: string; // URL to the file
}

export interface SearchFilters {
  query: string;
  tags: string[];
  year?: string;
}
