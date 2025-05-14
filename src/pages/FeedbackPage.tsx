import React, { useEffect, useState } from 'react';
import { fetchFeedbacks, createFeedback, deleteFeedback } from '../services/feedbackService';
import { testBackendConnection, testCreateFeedback } from '../services/debugService';
import { Tool } from '../types';
import Header from '../components/Header';
import ConfirmDialog from '../components/ConfirmDialog';
import FeedbackForm from '../components/FeedbackForm';
import { useAuth } from '../auth/AuthContext';
import { MessageSquare, Star, Trash2, Plus, Search, Bug } from 'lucide-react';

const FeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Tool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [currentFeedback, setCurrentFeedback] = useState<Tool | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
    // Load feedbacks from API
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        setLoading(true);
        const feedbackData = await fetchFeedbacks();
        setFeedbacks(feedbackData);
        
        // Check if user is an admin
        if (user?.email) {
          // Assuming roles are in user claims or token
          // This is a simplification - in real app you would check the token claims
          setIsAdmin(user.email.includes('admin') || user['https://app/roles']?.includes('ADMIN'));
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
        setError('Erro ao carregar feedbacks. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadFeedbacks();
  }, [user]);
  
  // Filter feedbacks based on search term
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const title = feedback.title || feedback.titulo || '';
    const description = feedback.description || feedback.descricao || '';
    
    const matchesSearch = searchTerm === '' || 
      title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });
    
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
    const handleDeleteFeedback = (feedbackId: string) => {
    setFeedbackToDelete(feedbackId);
    setIsConfirmOpen(true);
  };
    const confirmDelete = async () => {
    if (feedbackToDelete && user?.email) {
      try {
        await deleteFeedback(feedbackToDelete, user.email);
        setFeedbacks(feedbacks.filter(feedback => feedback.id !== feedbackToDelete));
      } catch (err) {
        console.error('Failed to delete feedback:', err);
        setError('Erro ao deletar feedback. Por favor, tente novamente.');
      }
    }
    setIsConfirmOpen(false);
    setFeedbackToDelete(null);
  };

  const handleAddFeedback = () => {
    setCurrentFeedback(undefined);
    setIsFormOpen(true);
  };  const handleSaveFeedback = async (feedback: Tool) => {
    try {
      setLoading(true);
      
      if (user?.email) {
        console.log('Submitting feedback as user:', user.email);
        console.log('Is admin:', isAdmin);
        console.log('Feedback data:', feedback);
        
        // Ensure feedback has all required fields
        const preparedFeedback = {
          ...feedback,
          titulo: feedback.titulo || feedback.title || '',
          descricao: feedback.descricao || feedback.description || '',
          nota: feedback.nota !== undefined ? feedback.nota : 
               (feedback.rating !== undefined ? feedback.rating : 5)
        };
        
        // Apenas criação de novos feedbacks é permitida
        const savedFeedback = await createFeedback(preparedFeedback, user.email);
        setFeedbacks([savedFeedback, ...feedbacks]);
        
        setIsFormOpen(false);
        setError(null);
      } else {
        setError('Usuário não autenticado. Por favor, faça login novamente.');
      }
    } catch (err: any) {
      console.error('Failed to save feedback:', err);
      
      // Enhanced error reporting
      if (err.response) {
        console.error('Error response:', {
          status: err.response.status,
          data: err.response.data
        });
        
        if (err.response.data?.message) {
          setError(`Erro ao salvar feedback: ${err.response.data.message}`);
        } else {
          setError(`Erro ao salvar feedback: ${err.response.status}`);
        }
      } else {
        setError('Erro ao salvar feedback. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} onAddNote={handleAddFeedback} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Admin badge */}
        {isAdmin && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <p className="text-blue-700 font-medium">Você está logado como administrador e pode excluir feedbacks.</p>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {/* Add Feedback Button */}
        <div className="mb-6">
          <button
            onClick={handleAddFeedback}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Enviar Novo Feedback</span>
          </button>
        </div>
        
        {/* Loading indicator */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Empty state */}
            {filteredFeedbacks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-medium text-gray-700 mb-2">Nenhum feedback encontrado</h2>
                <p className="text-gray-500 max-w-md">
                  {searchTerm 
                    ? "Tente ajustar sua pesquisa para encontrar o que está procurando."
                    : "Seja o primeiro a enviar um feedback!"}
                </p>
              </div>
            ) : (
              /* Feedback grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFeedbacks.map((feedback) => (
                  <div 
                    key={feedback.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg text-gray-800 mb-2 flex-grow truncate">
                          {feedback.title || feedback.titulo}
                        </h3>
                        {isAdmin && (
                          <div className="flex gap-1 ml-2">
                            <button 
                              onClick={() => handleDeleteFeedback(feedback.id)}
                              className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                              aria-label="Deletar feedback"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <Star className={`h-4 w-4 ${feedback.nota >= 5 ? 'text-yellow-400' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">
                          {feedback.nota || feedback.rating || 0}/10
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                        {feedback.description || feedback.descricao}
                      </p>
                      
                      <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                        <span>Usuário: {feedback.nomeUsuario || 'Anônimo'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Confirmation dialog for deletion */}
      {isConfirmOpen && (
        <ConfirmDialog
          title="Excluir Feedback"
          message="Tem certeza que deseja excluir este feedback? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={confirmDelete}
          onCancel={() => setIsConfirmOpen(false)}
          isDestructive
        />
      )}      {isFormOpen && (
        <FeedbackForm
          tool={currentFeedback}
          onSave={handleSaveFeedback}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default FeedbackPage;
