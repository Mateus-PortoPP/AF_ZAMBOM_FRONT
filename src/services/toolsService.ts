import api from './api';
import { Tool } from '../types';
import { useAuth } from '../auth/AuthContext';

// Helper function to map backend data to frontend model
const mapToFrontendTool = (backendTool: any): Tool => {
  return {
    ...backendTool,
    // Map backend properties to frontend properties
    title: backendTool.titulo,
    description: backendTool.descricao,
    rating: backendTool.nota,
  };
};

// Helper function to map frontend data to backend model
const mapToBackendTool = (frontendTool: any): any => {
  const { title, description, rating, ...rest } = frontendTool;
  
  return {
    ...rest,
    // Map frontend properties to backend properties
    titulo: title || frontendTool.titulo,
    descricao: description || frontendTool.descricao,
    nota: rating || frontendTool.nota,
  };
};

export const fetchTools = async (): Promise<Tool[]> => {
  try {
    const response = await api.get('/');
    // Map each tool from backend format to frontend format
    return response.data.map(mapToFrontendTool);
  } catch (error) {
    console.error('Erro ao buscar as ferramentas:', error);
    throw error;
  }
};

export const fetchToolById = async (id: string): Promise<Tool> => {
  try {
    const response = await api.get(`/${id}`);
    // Map the tool from backend format to frontend format
    return mapToFrontendTool(response.data);
  } catch (error) {
    console.error(`Erro ao buscar a ferramenta com id ${id}:`, error);
    throw error;
  }
};

export const createTool = async (toolData: Omit<Tool, 'id'>, userEmail: string): Promise<Tool> => {
  try {
    // Map the tool data to backend format before sending
    const backendToolData = mapToBackendTool(toolData);
    const response = await api.post('/', backendToolData, {
      headers: {
        'email': userEmail
      }
    });
    // Map the returned tool to frontend format
    return mapToFrontendTool(response.data);
  } catch (error) {
    console.error('Erro ao criar ferramenta:', error);
    throw error;
  }
};

export const updateTool = async (id: string, toolData: Partial<Tool>, userEmail: string): Promise<Tool> => {
  try {
    // Map the tool data to backend format before sending
    const backendToolData = mapToBackendTool(toolData);
    const response = await api.put(`/${id}`, backendToolData, {
      headers: {
        'email': userEmail
      }
    });
    // Map the returned tool to frontend format
    return mapToFrontendTool(response.data);
  } catch (error) {
    console.error(`Erro ao atualizar a ferramenta com id ${id}:`, error);
    throw error;
  }
};

export const deleteTool = async (id: string, userEmail: string): Promise<void> => {
  try {
    await api.delete(`/${id}`, {
      headers: {
        'email': userEmail
      }
    });
  } catch (error) {
    console.error(`Erro ao deletar a ferramenta com id ${id}:`, error);
    throw error;
  }
};
