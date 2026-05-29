import ApiClient from '../client';

export const stockService = {
  stockIn: (data: any) =>
    ApiClient.post('/stock/in', data),

  stockOut: (data: any) =>
    ApiClient.post('/stock/out', data),

  getHistory: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return ApiClient.get(`/stock/history${queryString ? '?' + queryString : ''}`);
  },

  getTransactions: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return ApiClient.get(`/transactions${queryString ? '?' + queryString : ''}`);
  },
};
