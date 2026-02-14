'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthState, User, JWTPayload } from '../types/auth';

interface AuthContextType extends Omit<AuthState, 'refreshToken'> {
  login: (token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  const decodeToken = (token: string): User | null => {
    try {
      const payload: JWTPayload = jwtDecode(token);
      return {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        storeId: payload.storeId,
      };
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    const user = decodeToken(token);
    setAuthState({
      user,
      token,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
    });
  };

  const refreshToken = async () => {
    // Implement token refresh logic here
    // For now, just check if token is expired
    if (authState.token) {
      const payload: JWTPayload = jwtDecode(authState.token);
      if (payload.exp * 1000 < Date.now()) {
        // Token expired, logout or refresh
        logout();
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const user = decodeToken(token);
      if (user) {
        setAuthState({
          user,
          token,
          isLoading: false,
        });
      } else {
        logout();
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, refreshToken}}>
      {children}
    </AuthContext.Provider>
  );
};