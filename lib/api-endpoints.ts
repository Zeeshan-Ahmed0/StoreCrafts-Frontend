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
    LIST: (storeSlug?: string) => storeSlug ? `/products?store_slug=${storeSlug}` : '/products',
    GET: (id: string, storeSlug?: string) => storeSlug ? `/products/${id}?store_slug=${storeSlug}` : `/products/${id}`,
    CREATE: (storeSlug?: string) => storeSlug ? `/products?store_slug=${storeSlug}` : '/products',
    UPDATE: (id: string, storeSlug?: string) => storeSlug ? `/products/${id}?store_slug=${storeSlug}` : `/products/${id}`,
    DELETE: (id: string, storeSlug?: string) => storeSlug ? `/products/${id}?store_slug=${storeSlug}` : `/products/${id}`,
  },
  CATEGORIES: {
    LIST: (storeSlug?: string) => storeSlug ? `/categories?store_slug=${storeSlug}` : '/categories',
    GET: (id: string, storeSlug?: string) => storeSlug ? `/categories/${id}?store_slug=${storeSlug}` : `/categories/${id}`,
    CREATE: (storeSlug?: string) => storeSlug ? `/categories?store_slug=${storeSlug}` : '/categories',
    UPDATE: (id: string, storeSlug?: string) => storeSlug ? `/categories/${id}?store_slug=${storeSlug}` : `/categories/${id}`,
    DELETE: (id: string, storeSlug?: string) => storeSlug ? `/categories/${id}?store_slug=${storeSlug}` : `/categories/${id}`,
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
    LIST: (storeSlug?: string) => storeSlug ? `/coupons?store_slug=${storeSlug}` : '/coupons',
    CREATE: (storeSlug?: string) => storeSlug ? `/coupons?store_slug=${storeSlug}` : '/coupons',
    UPDATE: (id: string, storeSlug?: string) => storeSlug ? `/coupons/${id}?store_slug=${storeSlug}` : `/coupons/${id}`,
    DELETE: (id: string, storeSlug?: string) => storeSlug ? `/coupons/${id}?store_slug=${storeSlug}` : `/coupons/${id}`,
  },
  REVIEWS: {
    LIST: (storeSlug?: string) => storeSlug ? `/reviews?store_slug=${storeSlug}` : '/reviews',
    GET: (id: string, storeSlug?: string) => storeSlug ? `/reviews/${id}?store_slug=${storeSlug}` : `/reviews/${id}`,
    UPDATE: (id: string, storeSlug?: string) => storeSlug ? `/reviews/${id}?store_slug=${storeSlug}` : `/reviews/${id}`,
    DELETE: (id: string, storeSlug?: string) => storeSlug ? `/reviews/${id}?store_slug=${storeSlug}` : `/reviews/${id}`,
  },
  ORDERS: {
    LIST: (storeSlug?: string) => storeSlug ? `/orders?store_slug=${storeSlug}` : '/orders',
    GET: (id: string, storeSlug?: string) => storeSlug ? `/orders/${id}?store_slug=${storeSlug}` : `/orders/${id}`,
    UPDATE: (id: string, storeSlug?: string) => storeSlug ? `/orders/${id}?store_slug=${storeSlug}` : `/orders/${id}`,
    DELETE: (id: string, storeSlug?: string) => storeSlug ? `/orders/${id}?store_slug=${storeSlug}` : `/orders/${id}`,
  },
  USERS: {
    LIST: (storeSlug?: string) => storeSlug ? `/users?store_slug=${storeSlug}` : '/users',
    GET: (id: string, storeSlug?: string) => storeSlug ? `/users/${id}?store_slug=${storeSlug}` : `/users/${id}`,
    CREATE: (storeSlug?: string) => storeSlug ? `/users?store_slug=${storeSlug}` : '/users',
    UPDATE: (id: string, storeSlug?: string) => storeSlug ? `/users/${id}?store_slug=${storeSlug}` : `/users/${id}`,
    DELETE: (id: string, storeSlug?: string) => storeSlug ? `/users/${id}?store_slug=${storeSlug}` : `/users/${id}`,
  },
};
