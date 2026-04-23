import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vectorforge-backend.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const vectorSearch = async (vector, k, metric, algo) => {
  const { data } = await api.post('/search/query', { vector, k, metric, algo });
  return data;
};

export const getSystemStatus = async () => {
  const { data } = await axios.get('https://vectorforge-backend.onrender.com/system/status');
  return data;
};

export const runBenchmark = async (vector, k, metric) => {
  const { data } = await api.post('/benchmark/run', { vector, k, metric });
  return data;
};

export const askRAG = async (question, k = 3) => {
  const { data } = await api.post('/rag/ask', { question, k });
  return data;
};

export const uploadDocument = async (title, text) => {
  const { data } = await api.post('/docs/upload', { title, text });
  return data;
};

export const listDocuments = async () => {
  const { data } = await api.get('/docs/list');
  return data;
};

export default api;
