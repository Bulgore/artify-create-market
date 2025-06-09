
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export type Language = 'fr' | 'en' | 'ty';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  getLocalizedField: (obj: any, fieldName: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface Translations {
  [key: string]: {
    fr?: string;
    en?: string;
    ty?: string;
  };
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr');
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  // Charger les traductions depuis la base
  const loadTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('interface_translations')
        .select('key, value_fr, value_en, value_ty');

      if (error) throw error;

      const translationsMap: Translations = {};
      data?.forEach(item => {
        translationsMap[item.key] = {
          fr: item.value_fr || '',
          en: item.value_en || '',
          ty: item.value_ty || ''
        };
      });

      setTranslations(translationsMap);
    } catch (error) {
      console.error('Erreur lors du chargement des traductions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les préférences utilisateur
  const loadUserLanguagePreference = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preferred_language')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.preferred_language) {
        setCurrentLanguage(data.preferred_language as Language);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  };

  // Sauvegarder les préférences utilisateur
  const saveUserLanguagePreference = async (lang: Language) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferred_language: lang
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
    }
  };

  useEffect(() => {
    loadTranslations();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserLanguagePreference();
    }
  }, [user]);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferred_language', lang);
    if (user) {
      saveUserLanguagePreference(lang);
    }
  };

  // Fonction de traduction
  const t = (key: string, fallback?: string): string => {
    const translation = translations[key];
    if (!translation) {
      return fallback || key;
    }

    return translation[currentLanguage] || translation.fr || translation.en || translation.ty || fallback || key;
  };

  // Fonction pour récupérer un champ localisé d'un objet
  const getLocalizedField = (obj: any, fieldName: string): string => {
    if (!obj) return '';
    
    const localizedValue = obj[`${fieldName}_${currentLanguage}`];
    if (localizedValue) return localizedValue;
    
    // Fallback vers français si la langue actuelle n'est pas disponible
    const frenchValue = obj[`${fieldName}_fr`];
    if (frenchValue) return frenchValue;
    
    // Fallback vers anglais
    const englishValue = obj[`${fieldName}_en`];
    if (englishValue) return englishValue;
    
    // Fallback vers tahitien
    const tahitianValue = obj[`${fieldName}_ty`];
    if (tahitianValue) return tahitianValue;
    
    // Fallback vers le champ sans suffixe (ancien format)
    return obj[fieldName] || '';
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        getLocalizedField,
        isLoading
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
