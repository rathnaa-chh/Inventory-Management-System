import ApiClient from '../client';

export const categoryService = {
  getAll: () =>
    ApiClient.get('/categories'),

  getById: (id: number) =>
    ApiClient.get(`/categories/${id}`),

  create: (data: any) =>
    ApiClient.post('/categories', data),

  update: (id: number, data: any) =>
    ApiClient.put(`/categories/${id}`, data),

  delete: (id: number) =>
    ApiClient.delete(`/categories/${id}`),
};
