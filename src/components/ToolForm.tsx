import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Tool } from '../types';

interface ToolFormProps {
  tool?: Tool;
  onSave: (tool: Tool) => void;
  onCancel: () => void;
  categories: string[];
}

const ToolForm: React.FC<ToolFormProps> = ({ tool, onSave, onCancel, categories }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    if (tool) {
      setNome(tool.nome || tool.name || '');
      setDescricao(tool.descricao || tool.description || '');
      setCategoria(tool.categoria || tool.category || '');
    }
  }, [tool]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategoria = showNewCategory ? newCategory : categoria;
    
    const updatedTool: Tool = {
      id: tool?.id || '',
      nome,
      descricao,
      categoria: finalCategoria,
      // Keep other properties from original tool if present
      ...(tool ? {
        nomeUsuario: tool.nomeUsuario,
        emailUsuario: tool.emailUsuario,
      } : {})
    };
    
    onSave(updatedTool);
    resetForm();
  };

  const resetForm = () => {
    setNome('');
    setDescricao('');
    setCategoria('');
    setNewCategory('');
    setShowNewCategory(false);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setShowNewCategory(true);
      setCategoria('');
    } else {
      setShowNewCategory(false);
      setCategoria(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-auto animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {tool ? 'Editar Ferramenta' : 'Criar Nova Ferramenta'}
          </h2>
          <button 
            onClick={onCancel} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome da ferramenta"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
              placeholder="Descreva a ferramenta aqui..."
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            {!showNewCategory ? (
              <select
                id="categoria"
                value={categoria}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="new">+ Adicionar nova categoria</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome da nova categoria"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewCategory(false)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {tool ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ToolForm;