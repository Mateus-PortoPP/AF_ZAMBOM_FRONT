import axios from 'axios';

// A URL base da sua API (definida no .env)
const API = process.env.REACT_APP_API_URL;

/**
 * Busca todos os feedbacks
 * GET /api/feedbacks
 */
export function listarFeedbacks() {
  return axios.get(API);
}

/**
 * Cria um novo feedback
 * POST /api/feedbacks
 * @param {Object} data  { titulo, descricao, nota }
 * @param {string} email header "email" exigido pelo back
 */
export function criarFeedback(data, email) {
  return axios.post(API, data, {
    headers: { email }
  });
}
