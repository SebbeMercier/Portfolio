// Hook pour gérer les traductions
import { useState, useEffect, createContext, useContext } from 'react';
import { translations, availableLanguages, defaultLanguage } from '../translations';
import { supabase } from '../services/supabase';

// Contexte pour les traductions
const TranslationContext = createContext();

// Hook pour utiliser les traductions
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Provider pour les traductions
export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [loading, setLoading] = useState(true);

  // Charger la langue sauvegardée au démarrage
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const { data, error } = await supabase
        .from('cv_settings')
        .select('value')
        .eq('key', 'preferred_language')
        .single();

      if (!error && data?.value) {
        const savedLang = data.value;
        if (translations[savedLang]) {
          setCurrentLanguage(savedLang);
        }
      }
    } catch (error) {
      console.log('Aucune langue sauvegardée, utilisation de la langue par défaut');
    }
    setLoading(false);
  };

  // Changer de langue et sauvegarder
  const changeLanguage = async (languageCode) => {
    if (!translations[languageCode]) {
      console.error(`Langue non supportée: ${languageCode}`);
      return;
    }

    setCurrentLanguage(languageCode);

    // Sauvegarder en base de données
    try {
      const { error } = await supabase
        .from('cv_settings')
        .upsert([
          {
            key: 'preferred_language',
            value: languageCode
          }
        ], {
          onConflict: 'key'
        });

      if (error) {
        console.error('Erreur sauvegarde langue:', error);
      }
    } catch (error) {
      console.error('Erreur sauvegarde langue:', error);
    }
  };

  // Fonction pour obtenir une traduction
  const t = (key, fallback = key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback;
      }
    }

    return typeof value === 'string' ? value : fallback;
  };

  // Fonction pour obtenir les traductions d'une section complète
  const getSection = (sectionKey) => {
    return translations[currentLanguage]?.[sectionKey] || {};
  };

  const value = {
    currentLanguage,
    availableLanguages,
    changeLanguage,
    t,
    getSection,
    loading
  };

  return (
    <TranslationContext.Provider value={value}>
      {/* Toujours afficher les enfants pour éviter l'écran blanc si Supabase met du temps */}
      {children}
    </TranslationContext.Provider>
  );
};

export default useTranslation;