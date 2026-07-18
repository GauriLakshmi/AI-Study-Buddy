import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDecks = async (userId) => {
  const response = await API.get('/decks', { params: { userId } });
  return response.data;
};

export const createDeck = async ({ name, userId }) => {
  const response = await API.post('/decks', { name, userId });
  return response.data;
};

export const deleteDeck = async (id) => {
  const response = await API.delete(`/decks/${id}`);
  return response.data;
};

export const getFlashcards = async (deckId) => {
  const response = await API.get('/flashcards', { params: { deckId } });
  return response.data;
};

export const updateFlashcard = async (id, updateData) => {
  const response = await API.put(`/flashcards/${id}`, updateData);
  return response.data;
};

export const generateFlashcards = async ({ topic, userId, deckId, numCards }) => {
  const response = await API.post('/flashcards/generate', { topic, userId, deckId, numCards });
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

export const generateQuiz = async ({ topic, difficulty, numQuestions }) => {
  const response = await API.post('/quizzes/generate', { topic, difficulty, numQuestions });
  return response.data;
};

export default {
  getDecks,
  createDeck,
  deleteDeck,
  getFlashcards,
  updateFlashcard,
  generateFlashcards,
  getResearchResults,
  getResearchResult,
  runResearchPipeline,
  deleteResearchResult,
  generateQuiz,
};
