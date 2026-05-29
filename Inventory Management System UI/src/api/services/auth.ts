import ApiClient from '../client';

export const authService = {
  login: (email: string, password: string) =>
    ApiClient.post('/auth/login', { email, password }),

  logout: () =>
    ApiClient.post('/auth/logout'),

  register: (userData: any) =>
    ApiClient.post('/auth/register', userData),

  getProfile: () =>
    ApiClient.get('/auth/profile'),

  updateProfile: (data: any) =>
    ApiClient.put('/auth/profile', data),

  changePassword: (data: any) =>
    ApiClient.put('/auth/change-password', data),

  setAuthToken: (token: string) =>
    ApiClient.setAuthToken(token),

  clearAuthToken: () =>
    ApiClient.clearAuthToken(),
};
