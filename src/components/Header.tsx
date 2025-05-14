import React from 'react';
import { Search, Plus, MessageSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  onAddNote: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onAddNote }) => {
  const auth = useAuth();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-xl font-semibold text-gray-800">Sistema de Feedback</h1>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Buscar feedbacks..."
                onChange={handleSearch}
              />
            </div>
            <button
              onClick={onAddNote}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Enviar Feedback</span>
            </button>
            
            {/* User info e botão de logout */}
            <div className="flex items-center ml-2">
              <div className="hidden md:flex items-center mr-2">
                <User className="h-4 w-4 text-gray-600 mr-1" />
                <span className="text-sm text-gray-700">
                  {auth.user?.email}
                </span>
              </div>
              <button
                onClick={() => auth.logout()}
                title="Logout"
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;