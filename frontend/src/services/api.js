import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDecks = async (userId) => {
  const response = await API.get('/decks', { params: { userId } });
  return response.data;
};

export const getResearchResults = async (userId) => {
  const response = await API.get('/research-results', { params: { userId } });
  return response.data;
};

export const getResearchResult = async (id) => {
  const response = await API.get(`/research-results/${id}`);
  return response.data;
};

export const runResearchPipeline = async ({ topic, userId, deckId }) => {
  const response = await API.post('/research-results', { topic, userId, deckId });
  return response.data;
};

export const deleteResearchResult = async (id) => {
  const response = await API.delete(`/research-results/${id}`);
  return response.data;
};

export default {
  getDecks,
  getResearchResults,
  getResearchResult,
  runResearchPipeline,
  deleteResearchResult,
};
