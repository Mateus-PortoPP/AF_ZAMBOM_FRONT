import { Note } from '../types/Note';

// Get notes from localStorage
export const getNotes = (): Note[] => {
  const notes = localStorage.getItem('notes');
  return notes ? JSON.parse(notes) : [];
};

// Save notes to localStorage
export const saveNotes = (notes: Note[]): void => {
  localStorage.setItem('notes', JSON.stringify(notes));
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Filter notes by search term
export const filterNotes = (notes: Note[], searchTerm: string): Note[] => {
  if (!searchTerm.trim()) return notes;
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return notes.filter(
    note => 
      note.title.toLowerCase().includes(lowerCaseSearchTerm) || 
      note.content.toLowerCase().includes(lowerCaseSearchTerm) ||
      note.category.toLowerCase().includes(lowerCaseSearchTerm)
  );
};

// Sort notes by date (newest first)
export const sortNotesByDate = (notes: Note[]): Note[] => {
  return [...notes].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
};

// Get all unique categories from notes
export const getCategories = (notes: Note[]): string[] => {
  const categoriesSet = new Set(notes.map(note => note.category));
  return Array.from(categoriesSet).filter(category => category !== '');
};

// Filter notes by category
export const filterNotesByCategory = (notes: Note[], category: string): Note[] => {
  if (category === 'all') return notes;
  return notes.filter(note => note.category === category);
};