// Este arquivo é um serviço de depuração que ajuda a identificar problemas com a comunicação API
import axios from 'axios';
import api from './api';

// Função para testar conexão com backend
export const testBackendConnection = async () => {
  try {
    console.log('Testando conexão com o backend...');
    
    // Testa conexão direta
    const response = await axios.get('http://localhost:8080/api/feedbacks');
    console.log('Resposta direta:', response.data);
    
    // Testa com api configurado
    const apiResponse = await api.get('/');
    console.log('Resposta via API service:', apiResponse.data);
    
    return {
      direct: response.data,
      api: apiResponse.data,
    };
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    return {
      error: error
    };
  }
};

// Função para testar criação de feedback
export const testCreateFeedback = async (email: string) => {
  const testFeedback = {
    titulo: 'Feedback de Teste',
    descricao: 'Este é um feedback de teste para diagnosticar problemas',
    nota: 8
  };

  try {
    console.log('Enviando feedback de teste para o backend...');
    console.log('Dados:', testFeedback);
    console.log('Email do usuário:', email);
    
    const response = await api.post('/', testFeedback, {
      headers: {
        'email': email,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Resposta de teste:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar feedback de teste:', error);
    return {
      error: error
    };
  }
};
