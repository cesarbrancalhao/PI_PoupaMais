export type Language = 'pt' | 'en' | 'es';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <T>(translations: Record<Language, T>) => T;
}
