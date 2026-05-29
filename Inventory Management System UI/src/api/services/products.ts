import ApiClient from '../client';

export const productService = {
  getAll: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return ApiClient.get(`/products${queryString ? '?' + queryString : ''}`);
  },

  getById: (id: number) =>
    ApiClient.get(`/products/${id}`),

  create: (data: any) =>
    ApiClient.post('/products', data),

  update: (id: number, data: any) =>
    ApiClient.put(`/products/${id}`, data),

  delete: (id: number) =>
    ApiClient.delete(`/products/${id}`),
};
