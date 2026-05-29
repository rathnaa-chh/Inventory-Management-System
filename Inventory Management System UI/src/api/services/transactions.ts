import ApiClient from '../client';

export const transactionService = {
  getAll: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return ApiClient.get(`/transactions${queryString ? '?' + queryString : ''}`);
  },

  getById: (id: number) =>
    ApiClient.get(`/transactions/${id}`),

  create: (data: any) =>
    ApiClient.post('/transactions', data),

  getSummary: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return ApiClient.get(`/transactions/summary${queryString ? '?' + queryString : ''}`);
  },

  getLowStock: (threshold: number = 10) =>
    ApiClient.get(`/transactions/low-stock?threshold=${threshold}`),

  getDashboardStats: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return ApiClient.get(`/dashboard/stats${queryString ? '?' + queryString : ''}`);
  },
};
