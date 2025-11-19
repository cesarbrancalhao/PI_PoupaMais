'use client';

import { useState, useEffect } from 'react';
import { Language } from './language/types';

export function useAuthLanguage() {
  const [language, setLanguageState] = useState<Language>('pt');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth-language') as Language | null;
    if (stored && ['pt', 'en', 'es'].includes(stored)) {
      setLanguageState(stored);
    }
    setIsLoaded(true);
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('auth-language', newLanguage);
  };

  // Helper function to get translated text
  const t = <T,>(translations: Record<Language, T>): T => {
    return translations[language] || translations['pt'];
  };

  return { language, setLanguage, t, isLoaded };
}
