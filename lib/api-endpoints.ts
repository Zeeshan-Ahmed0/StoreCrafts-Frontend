// API Configuration Constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// API Endpoints
export const ENDPOINTS = {
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
  CATEGORIES: {
    LIST: '/categories',
    GET: (id: string) => `/categories/${id}`,
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },
  BANNERS: {
    PUBLIC: (storeId: string) => `/banners/public/${storeId}`,
    LIST: '/banners',
    CREATE: '/banners',
    UPDATE: (id: string) => `/banners/${id}`,
    DELETE: (id: string) => `/banners/${id}`,
  },
  COUPONS: {
    PUBLIC: (storeId: string) => `/coupons/public/${storeId}`,
    LIST: '/coupons',
    CREATE: '/coupons',
    UPDATE: (id: string) => `/coupons/${id}`,
    DELETE: (id: string) => `/coupons/${id}`,
  },
  REVIEWS: {
    LIST: '/reviews',
    GET: (id: string) => `/reviews/${id}`,
    UPDATE: (id: string) => `/reviews/${id}`,
    DELETE: (id: string) => `/reviews/${id}`,
  },
  ORDERS: {
    LIST: '/orders',
    GET: (id: string) => `/orders/${id}`,
    UPDATE: (id: string) => `/orders/${id}`,
    DELETE: (id: string) => `/orders/${id}`,
  },
  USERS: {
    LIST: '/users',
    GET: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
};
