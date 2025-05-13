import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Note } from '../types/Note';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg text-gray-800 mb-2 flex-grow truncate">{note.title}</h3>
          <div className="flex gap-1 ml-2">
            <button 
              onClick={() => onEdit(note)}
              className="text-gray-500 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-50"
              aria-label="Edit note"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onDelete(note.id)}
              className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
              aria-label="Delete note"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {note.category && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
            {note.category}
          </span>
        )}
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-2">{note.content}</p>
        
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
          <span>Updated: {formatDate(note.updatedAt)}</span>
          <span>Created: {formatDate(note.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;