import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import CategoryFilter from '../components/CategoryFilter';
import ConfirmDialog from '../components/ConfirmDialog';
import { Note } from '../types/Note';
import { 
  getNotes, 
  saveNotes, 
  filterNotes, 
  sortNotesByDate,
  getCategories,
  filterNotesByCategory
} from '../utils/noteUtils';
import { useAuth } from '../auth/AuthContext';

const NotesPage: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | undefined>(undefined);
  
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    // Load notes from localStorage on initial render
    const loadedNotes = getNotes();
    setNotes(loadedNotes);
    
    // Extract categories from loaded notes
    const loadedCategories = getCategories(loadedNotes);
    setCategories(loadedCategories);
  }, []);

  useEffect(() => {
    // Filter and sort notes when notes, searchTerm, or selectedCategory changes
    let result = sortNotesByDate(notes);
    
    // Filter by category first
    result = filterNotesByCategory(result, selectedCategory);
    
    // Then filter by search term
    result = filterNotes(result, searchTerm);
    
    setFilteredNotes(result);
  }, [notes, searchTerm, selectedCategory]);

  const handleSaveNote = (note: Note) => {
    let updatedNotes: Note[];
    
    if (currentNote) {
      // Update existing note
      updatedNotes = notes.map(n => n.id === note.id ? note : n);
    } else {
      // Add new note
      updatedNotes = [note, ...notes];
    }
    
    // Save to state and localStorage
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    
    // Update categories
    setCategories(getCategories(updatedNotes));
    
    // Close form and reset current note
    setIsFormOpen(false);
    setCurrentNote(undefined);
  };

  const handleDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      const updatedNotes = notes.filter(note => note.id !== noteToDelete);
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      
      // Update categories
      setCategories(getCategories(updatedNotes));
    }
    
    setIsConfirmOpen(false);
    setNoteToDelete(null);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsFormOpen(true);
  };

  const handleAddNote = () => {
    setCurrentNote(undefined);
    setIsFormOpen(true);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} onAddNote={handleAddNote} />
      
      <main className="container mx-auto px-4 py-6">
        {user?.isAdmin && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <p className="text-blue-700 font-medium">Você está logado como administrador e tem acesso a todas as funcionalidades.</p>
          </div>
        )}
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
        
        <NoteList 
          notes={filteredNotes}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />
      </main>
      
      {isFormOpen && (
        <NoteForm 
          note={currentNote}
          onSave={handleSaveNote}
          onCancel={() => setIsFormOpen(false)}
          categories={categories}
        />
      )}
      
      {isConfirmOpen && (
        <ConfirmDialog
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setIsConfirmOpen(false)}
          isDestructive
        />
      )}
    </div>
  );
};

export default NotesPage;
