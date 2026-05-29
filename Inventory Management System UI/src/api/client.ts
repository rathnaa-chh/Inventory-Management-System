
import { API_BASE_URL } from "../config";

interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
}

export class ApiClient {
  private static getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private static getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  static async get(endpoint: string, options?: RequestOptions) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(options?.headers),
    });

    return this.handleResponse(response);
  }

  static async post(endpoint: string, data?: any, options?: RequestOptions) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  static async put(endpoint: string, data?: any, options?: RequestOptions) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  static async delete(endpoint: string, options?: RequestOptions) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(options?.headers),
    });

    return this.handleResponse(response);
  }

  private static async handleResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(data)}`);
    }

    return data;
  }

  static setAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  static clearAuthToken() {
    localStorage.removeItem('auth_token');
  }
}

export default ApiClient;
