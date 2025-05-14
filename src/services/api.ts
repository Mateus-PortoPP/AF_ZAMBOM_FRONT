import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://18.230.226.30:8080/api/feedbacks';

const api = axios.create({
  baseURL: API_URL,
});

// Adicionar interceptors para logging
api.interceptors.request.use(request => {
  console.log('API Request:', {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers
  });
  return request;
}, error => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(response => {
  console.log('API Response:', {
    status: response.status,
    data: response.data
  });
  return response;
}, error => {
  console.error('API Response Error:', error);
  if (error.response) {
    console.error('Error Response Data:', error.response.data);
    console.error('Error Response Status:', error.response.status);
  }
  return Promise.reject(error);
});

// Função para definir o token de autenticação
export const setAuthToken = (token: string | null) => {
  if (token) {
    console.log('Token definido:', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;