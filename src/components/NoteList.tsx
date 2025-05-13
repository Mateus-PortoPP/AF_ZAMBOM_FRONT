import React from 'react';
import NoteCard from './NoteCard';
import { Note } from '../types/Note';
import { StickyNote } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onEditNote, onDeleteNote }) => {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <StickyNote className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-medium text-gray-700 mb-2">No notes found</h2>
        <p className="text-gray-500 max-w-md">
          Start by creating your first note or try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEditNote}
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
};

export default NoteList;