import ApiClient from '../client';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'Active' | 'Inactive';
  created_at: string;
}

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'staff';
}

interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'manager' | 'staff';
}

export const userService = {
  /**
   * Get all users (admin only)
   */
  getAll: async (): Promise<User[]> => {
    const response = await ApiClient.get('/users');
    return Array.isArray(response) ? response : response?.data || [];
  },

  /**
   * Get single user by ID
   */
  getById: async (id: number): Promise<User> => {
    return await ApiClient.get(`/users/${id}`);
  },

  /**
   * Create new user (admin only)
   */
  create: async (payload: CreateUserPayload): Promise<{ message: string; user: User }> => {
    return await ApiClient.post('/users', payload);
  },

  /**
   * Update user (admin only)
   */
  update: async (id: number, payload: UpdateUserPayload): Promise<{ message: string; user: User }> => {
    return await ApiClient.put(`/users/${id}`, payload);
  },

  /**
   * Delete user (admin only)
   */
  delete: async (id: number): Promise<{ message: string }> => {
    return await ApiClient.delete(`/users/${id}`);
  },
};
