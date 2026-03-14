/**
 * Contexte des préférences utilisateur (allergènes, régimes, langue)
 * Persisté via AsyncStorage
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Allergen, DietaryPreference, UserPreferences } from '../types';

interface PreferencesContextType {
  preferences: UserPreferences;
  toggleAllergen: (allergen: Allergen) => void;
  toggleDiet: (diet: DietaryPreference) => void;
  setLanguage: (lang: 'fr' | 'en') => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  allergens: [],
  dietaryPreferences: [],
  language: 'fr',
};

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  toggleAllergen: () => {},
  toggleDiet: () => {},
  setLanguage: () => {},
  resetPreferences: () => {},
});

const PREFS_STORAGE_KEY = '@nutriscan_preferences';

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Charger les préférences au lancement
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const saved = await AsyncStorage.getItem(PREFS_STORAGE_KEY);
        if (saved) {
          setPreferences(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Erreur chargement préférences:', error);
      }
    };
    loadPrefs();
  }, []);

  // Sauvegarder les préférences à chaque modification
  const savePrefs = async (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    try {
      await AsyncStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(newPrefs));
    } catch (error) {
      console.error('Erreur sauvegarde préférences:', error);
    }
  };

  const toggleAllergen = (allergen: Allergen) => {
    const newAllergens = preferences.allergens.includes(allergen)
      ? preferences.allergens.filter((a) => a !== allergen)
      : [...preferences.allergens, allergen];
    savePrefs({ ...preferences, allergens: newAllergens });
  };

  const toggleDiet = (diet: DietaryPreference) => {
    const newDiets = preferences.dietaryPreferences.includes(diet)
      ? preferences.dietaryPreferences.filter((d) => d !== diet)
      : [...preferences.dietaryPreferences, diet];
    savePrefs({ ...preferences, dietaryPreferences: newDiets });
  };

  const setLanguage = (lang: 'fr' | 'en') => {
    savePrefs({ ...preferences, language: lang });
  };

  const resetPreferences = () => {
    savePrefs(defaultPreferences);
  };

  return (
    <PreferencesContext.Provider
      value={{ preferences, toggleAllergen, toggleDiet, setLanguage, resetPreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
