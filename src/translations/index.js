// Index des traductions
import { fr } from './fr';
import { en } from './en';
import { nl } from './nl';

export const translations = {
  fr,
  en,
  nl
};

export const availableLanguages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
];

export const defaultLanguage = 'fr';