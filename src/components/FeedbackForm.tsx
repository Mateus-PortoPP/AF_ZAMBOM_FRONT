import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Tool } from '../types';

interface FeedbackFormProps {
  tool?: Tool;
  onSave: (tool: Tool) => void;
  onCancel: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ tool, onSave, onCancel }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nota, setNota] = useState<number>(5);
  const [notaError, setNotaError] = useState<string>('');

  useEffect(() => {
    if (tool) {
      setTitulo(tool.titulo || tool.title || '');
      setDescricao(tool.descricao || tool.description || '');
      setNota(tool.nota || tool.rating || 5);
    }
  }, [tool]);

  const handleNotaChange = (value: string) => {
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue)) {
      setNotaError('Nota deve ser um número');
      return;
    }
    
    if (numValue < 0 || numValue > 10) {
      setNotaError('Nota deve estar entre 0 e 10');
      return;
    }
    
    setNotaError('');
    setNota(numValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (notaError) {
      return;
    }
    
    const updatedTool: Tool = {
      id: tool?.id || '',
      titulo,
      descricao,
      nota,
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
    setTitulo('');
    setDescricao('');
    setNota(5);
    setNotaError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-auto animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {tool ? 'Editar Feedback' : 'Enviar Novo Feedback'}
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
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título do feedback"
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
              placeholder="Descreva seu feedback aqui..."
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="nota" className="block text-sm font-medium text-gray-700 mb-1">
              Nota (0-10)
            </label>
            <input
              id="nota"
              type="number"
              min="0"
              max="10"
              value={nota}
              onChange={(e) => handleNotaChange(e.target.value)}
              className={`w-full px-3 py-2 border ${notaError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="De 0 a 10"
              required
            />
            {notaError && (
              <p className="text-red-500 text-sm mt-1">{notaError}</p>
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
              {tool ? 'Atualizar' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
