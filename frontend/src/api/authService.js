import api from './axiosConfig';

export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
};
