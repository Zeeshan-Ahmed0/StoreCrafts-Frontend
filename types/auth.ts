export type UserRole = 'store_admin' | 'super_admin' | 'customer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  storeId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  storeId?: string;
  exp: number;
  iat: number;
}