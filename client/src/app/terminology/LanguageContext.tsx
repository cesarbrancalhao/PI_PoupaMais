'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, LanguageContextType } from './language/types';
import { useAuth } from '@/contexts/AuthContext';
import { configsService } from '@/services/configs.service';
import { Idioma } from '@/types/configs';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Map between our short codes and database values
const languageToIdioma: Record<Language, Idioma> = {
  pt: 'portugues',
  en: 'ingles',
  es: 'espanhol',
};

const idiomaToLanguage: Record<Idioma, Language> = {
  portugues: 'pt',
  ingles: 'en',
  espanhol: 'es',
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAuth();
  const [language, setLanguageState] = useState<Language>(() => {
    if (user?.idioma) {
      return idiomaToLanguage[user.idioma] || 'pt';
    }
    return 'pt';
  });

  // Sync language with user config
  useEffect(() => {
    if (user?.idioma) {
      setLanguageState(idiomaToLanguage[user.idioma] || 'pt');
    }
  }, [user?.idioma]);

  const setLanguage = async (newLanguage: Language) => {
    if (!user) return;

    try {
      const idiomaValue = languageToIdioma[newLanguage];

      // Update language in backend
      await configsService.update({
        tema: user.tema || false,
        moeda: user.moeda || 'real',
        idioma: idiomaValue,
      });

      // Update local state
      setLanguageState(newLanguage);

      // Update user context
      setUser({
        ...user,
        idioma: idiomaValue,
      });
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  // Helper function to get translated text
  const t = <T,>(translations: Record<Language, T>): T => {
    return translations[language] || translations['pt'];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
