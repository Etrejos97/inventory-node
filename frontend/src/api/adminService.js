import api from './axiosConfig';

export const adminService = {
  // Dashboard
  getDashboard: () => api.get('/dashboard'),

  // Users
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getRoles: () => api.get('/users/roles'),

  // Categories
  getCategories: () => api.get('/categories'),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  // Statuses
  getStatuses: () => api.get('/statuses'),
  getStatus: (id) => api.get(`/statuses/${id}`),
  createStatus: (data) => api.post('/statuses', data),
  updateStatus: (id, data) => api.put(`/statuses/${id}`, data),
  deleteStatus: (id) => api.delete(`/statuses/${id}`),

  // Responsibles
  getResponsibles: () => api.get('/responsibles'),
  getResponsible: (id) => api.get(`/responsibles/${id}`),
  createResponsible: (data) => api.post('/responsibles', data),
  updateResponsible: (id, data) => api.put(`/responsibles/${id}`, data),
  deleteResponsible: (id) => api.delete(`/responsibles/${id}`),

  // Movements
  getMovements: (itemId) => api.get('/movements', { params: itemId ? { itemId } : {} }),
};
