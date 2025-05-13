import React, { useEffect, useState } from 'react';
import { fetchTools, createTool, updateTool, deleteTool } from '../services/toolsService';
import { Tool } from '../types';
import Header from '../components/Header';
import ConfirmDialog from '../components/ConfirmDialog';
import ToolForm from '../components/ToolForm';
import { useAuth } from '../auth/AuthContext';
import { Wrench, Edit2, Trash2, Plus, Tag } from 'lucide-react';

const ToolsPage: React.FC = () => {
  const { user } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [toolToDelete, setToolToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [currentTool, setCurrentTool] = useState<Tool | undefined>(undefined);
  
  // Load tools from API
  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        const toolsData = await fetchTools();
        setTools(toolsData);
        
        // Extract categories
        const uniqueCategories = Array.from(
          new Set(toolsData.map(tool => tool.category || tool.categoria || ''))
        ).filter(cat => cat !== '');
        
        setCategories(uniqueCategories);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tools:', err);
        setError('Erro ao carregar ferramentas. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadTools();
  }, []);
  
  // Filter tools based on search term and category
  const filteredTools = tools.filter(tool => {
    const name = tool.name || tool.nome || '';
    const description = tool.description || tool.descricao || '';
    const category = tool.category || tool.categoria || '';
    
    const matchesSearch = searchTerm === '' || 
      name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleDeleteTool = (toolId: string) => {
    setToolToDelete(toolId);
    setIsConfirmOpen(true);
  };
  
  const confirmDelete = async () => {
    if (toolToDelete) {
      try {
        await deleteTool(toolToDelete);
        setTools(tools.filter(tool => tool.id !== toolToDelete));
      } catch (err) {
        console.error('Failed to delete tool:', err);
        setError('Erro ao deletar ferramenta. Por favor, tente novamente.');
      }
    }
    setIsConfirmOpen(false);
    setToolToDelete(null);
  };
    const handleAddTool = () => {
    setCurrentTool(undefined); // Limpa qualquer ferramenta selecionada anteriormente
    setIsFormOpen(true); // Abre o formulário para criar uma nova ferramenta
  };
  
  const handleEditTool = (tool: Tool) => {
    setCurrentTool(tool); // Define a ferramenta atual para edição
    setIsFormOpen(true); // Abre o formulário com os dados da ferramenta
  };
  
  const handleSaveTool = async (tool: Tool) => {
    try {
      setLoading(true);
      let savedTool: Tool;
      
      if (tool.id) {
        // Atualizar ferramenta existente
        savedTool = await updateTool(tool.id, tool);
        // Atualizar a ferramenta na lista local
        setTools(tools.map(t => t.id === savedTool.id ? savedTool : t));
      } else {
        // Criar nova ferramenta
        savedTool = await createTool(tool);
        // Adicionar nova ferramenta à lista local
        setTools([savedTool, ...tools]);
      }
      
      // Atualizar categorias
      const uniqueCategories = Array.from(
        new Set([...categories, savedTool.categoria || savedTool.category || ''])
      ).filter(cat => cat !== '');
      setCategories(uniqueCategories);
      
      setIsFormOpen(false); // Fechar o formulário
      setError(null); // Limpar qualquer erro anterior
    } catch (err) {
      console.error('Failed to save tool:', err);
      setError('Erro ao salvar ferramenta. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} onAddNote={handleAddTool} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Admin badge */}
        {user?.isAdmin && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <p className="text-blue-700 font-medium">Você está logado como administrador e tem acesso a todas as funcionalidades.</p>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {/* Category filter */}
        {categories.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <h2 className="text-sm font-medium text-gray-700">Filtrar por categoria</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSelectCategory('all')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSelectCategory(category)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Loading indicator */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Empty state */}
            {filteredTools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wrench className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-medium text-gray-700 mb-2">Nenhuma ferramenta encontrada</h2>
                <p className="text-gray-500 max-w-md">
                  {searchTerm || selectedCategory !== 'all' 
                    ? "Tente ajustar seus filtros para encontrar o que está procurando."
                    : "Comece adicionando sua primeira ferramenta."}
                </p>
                
                {user?.isAdmin && (
                  <button
                    onClick={handleAddTool}
                    className="mt-4 flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Ferramenta</span>
                  </button>
                )}
              </div>
            ) : (
              /* Tools grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => (
                  <div 
                    key={tool.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg text-gray-800 mb-2 flex-grow truncate">
                          {tool.name || tool.nome}
                        </h3>
                        {user?.isAdmin && (                          <div className="flex gap-1 ml-2">
                            <button 
                              onClick={() => handleEditTool(tool)}
                              className="text-gray-500 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-50"
                              aria-label="Editar ferramenta"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTool(tool.id)}
                              className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                              aria-label="Deletar ferramenta"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {(tool.category || tool.categoria) && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                          {tool.category || tool.categoria}
                        </span>
                      )}
                      
                      <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                        {tool.description || tool.descricao}
                      </p>
                      
                      <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                        <span>Usuário: {tool.nomeUsuario || 'N/A'}</span>
                        <span>{tool.emailUsuario || ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Confirmation dialog for deletion */}      {isConfirmOpen && (
        <ConfirmDialog
          title="Excluir Ferramenta"
          message="Tem certeza que deseja excluir esta ferramenta? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={confirmDelete}
          onCancel={() => setIsConfirmOpen(false)}
          isDestructive
        />
      )}
      
      {isFormOpen && (
        <ToolForm
          tool={currentTool}
          onSave={handleSaveTool}
          onCancel={() => setIsFormOpen(false)}
          categories={categories}
        />
      )}
    </div>
  );
};

export default ToolsPage;
