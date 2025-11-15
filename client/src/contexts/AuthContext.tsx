'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { configsService } from '../services/configs.service';
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
    async function initAuth() {
      try {
        if (!authService.isAuthenticated()) {
          setUser(null);
          return;
        }

        const baseUser = authService.getUser();
        if (!baseUser) {
          setUser(null);
          return;
        }

        const configs = await configsService.get();

        setUser({
          ...baseUser,
          tema: configs.tema,
          moeda: configs.moeda,
          idioma: configs.idioma,
        });

      } catch (err) {
        console.error("Erro ao inicializar auth:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);
      const configs = await configsService.get();

      setUser({
        ...response.user!,
        tema: configs.tema,
        moeda: configs.moeda,
        idioma: configs.idioma,
      });

      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      const configs = await configsService.get();

      setUser({
        ...response.user!,
        tema: configs.tema,
        moeda: configs.moeda,
        idioma: configs.idioma,
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
