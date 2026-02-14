// API Configuration Constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  THEME: {
    GET: '/theme',
    UPDATE: '/theme',
  },
  STORES: {
    LIST: '/stores',
    GET: (id: string) => `/stores/${id}`,
    CREATE: '/stores',
    UPDATE: (id: string) => `/stores/${id}`,
    DELETE: (id: string) => `/stores/${id}`,
  },
  PRODUCTS: {
    LIST: '/products',
    GET: (id: string) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },
  USERS: {
    LIST: '/users',
    GET: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
};
