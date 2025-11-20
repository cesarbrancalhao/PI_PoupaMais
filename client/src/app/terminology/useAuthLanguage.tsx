'use client';

import { useState, useEffect } from 'react';
import { Language } from './language/types';

export function useAuthLanguage() {
  const [language, setLanguageState] = useState<Language>('pt');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('auth-language') as Language | null;
    if (stored && ['pt', 'en', 'es'].includes(stored)) {
      setLanguageState(stored);
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('auth-language', newLanguage);
  };

  const t = <T,>(translations: Record<Language, T>): T => {
    return translations[language] || translations['pt'];
  };

  return { language, setLanguage, t, isLoaded };
}
