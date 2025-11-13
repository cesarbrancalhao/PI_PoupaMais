'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { User, LoginRequest, RegisterRequest } from '../types/auth';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getUser();

          const response = await fetch(
            'http://localhost:3002/api/v1/configs',
            {
              headers: {
                Authorization: `Bearer ${authService.getToken()}`,
              },
            }
          );

          const configs = await response.json();

          setUser({
            ...currentUser!,
            tema: configs.tema,
            idioma: configs.idioma,
            moeda: configs.moeda,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);

      const configsResponse = await fetch(
        'http://localhost:3002/api/v1/configs',
        {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
          },
        }
      );

      const configs = await configsResponse.json();

      setUser({
        ...response.user!,
        tema: configs.tema,
        idioma: configs.idioma,
        moeda: configs.moeda,
      });

      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);

      const configsResponse = await fetch(
        'http://localhost:3002/api/v1/configs',
        {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
          },
        }
      );

      const configs = await configsResponse.json();

      setUser({
        ...response.user!,
        tema: configs.tema,
        idioma: configs.idioma,
        moeda: configs.moeda,
      });

      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/auth');
  };

  const value: AuthContextType = {
    user,
    setUser, 
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && authService.isAuthenticated(),
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Erro ao usar o contexto de autenticação');
  }
  return context;
}
