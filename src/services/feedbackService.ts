import api from './api';
import { Tool } from '../types';
import axios from 'axios';

// Helper function to map backend data to frontend model
const mapToFrontendFeedback = (backendFeedback: any): Tool => {
  return {
    ...backendFeedback,
    // Map backend properties to frontend properties
    title: backendFeedback.titulo,
    description: backendFeedback.descricao,
    rating: backendFeedback.nota,
  };
};

export const fetchFeedbacks = async (): Promise<Tool[]> => {
  try {
    console.log('Fetching feedbacks...');
    const response = await api.get('/');
    console.log('Feedbacks response:', response.data);
    // Map each feedback from backend format to frontend format
    return response.data.map(mapToFrontendFeedback);
  } catch (error) {
    console.error('Erro ao buscar os feedbacks:', error);
    throw error;
  }
};

export const createFeedback = async (feedbackData: Omit<Tool, 'id'>, userEmail: string): Promise<Tool> => {
  try {
    console.log('Creating feedback with data:', feedbackData);
    
    // Ensure we have the correct properties for backend
    const backendFeedbackData = {
      titulo: feedbackData.titulo || feedbackData.title || '',
      descricao: feedbackData.descricao || feedbackData.description || '',
      nota: feedbackData.nota !== undefined ? feedbackData.nota : 
            (feedbackData.rating !== undefined ? feedbackData.rating : 5)
    };
    
    console.log('Sending backend data:', backendFeedbackData);
    
    const response = await api.post('/', backendFeedbackData, {
      headers: {
        'email': userEmail,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Create feedback response:', response.data);
    // Map the returned feedback to frontend format
    return mapToFrontendFeedback(response.data);  } catch (error: any) {
    console.error('Erro ao criar feedback:', error);
    // Log more details about the error
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    throw error;
  }
};

export const deleteFeedback = async (id: string, userEmail: string): Promise<void> => {
  try {
    console.log(`Deleting feedback with id ${id}`);
    await api.delete(`/${id}`, {
      headers: {
        'email': userEmail
      }
    });
    console.log('Feedback deleted successfully');
  } catch (error) {
    console.error(`Erro ao deletar o feedback com id ${id}:`, error);
    throw error;
  }
};
