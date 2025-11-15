'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

type ThemeContextType = {
  theme: string;
  setTheme: (value: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();             
  const [theme, setTheme] = useState("claro");

  useEffect(() => {
    if (loading) return; 
    if (user?.tema !== undefined) {
      setTheme(user.tema ? 'escuro' : 'claro');
    }
  }, [user, loading]);

  useEffect(() => {
    document.documentElement.classList.remove("claro", "escuro");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
