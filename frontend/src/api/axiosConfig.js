import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const itemService = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
};

export const statusService = {
  getAll: () => api.get('/statuses'),
};

export const responsibleService = {
  getAll: () => api.get('/responsibles'),
};

export default api;
