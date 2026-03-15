/**
 * Contexte de données : historique des scans + favoris avec catégories
 * Persisté via AsyncStorage entre les sessions
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, HistoryEntry, FavoriteEntry, FavoriteCategory } from '../types';
import { DEFAULT_FAVORITE_CATEGORIES } from '../constants/colors';

interface DataContextType {
  history: HistoryEntry[];
  addToHistory: (product: Product) => void;
  removeFromHistory: (barcode: string) => void;
  clearHistory: () => void;
  favorites: FavoriteEntry[];
  addToFavorites: (product: Product, category: string) => void;
  removeFromFavorites: (barcode: string) => void;
  moveFavorite: (barcode: string, newCategory: string) => void;
  isFavorite: (barcode: string) => boolean;
  categories: FavoriteCategory[];
  addCategory: (name: string) => boolean;
  removeCategory: (id: string) => void;
  resetAllData: () => void;
  hasSeenOnboarding: boolean;
  setOnboardingComplete: () => void;
}

const DataContext = createContext<DataContextType>({
  history: [],
  addToHistory: () => {},
  removeFromHistory: () => {},
  clearHistory: () => {},
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  moveFavorite: () => {},
  isFavorite: () => false,
  categories: [],
  addCategory: () => false,
  removeCategory: () => {},
  resetAllData: () => {},
  hasSeenOnboarding: false,
  setOnboardingComplete: () => {},
});

const HISTORY_KEY = '@nutriscan_history';
const FAVORITES_KEY = '@nutriscan_favorites';
const CATEGORIES_KEY = '@nutriscan_categories';
const ONBOARDING_KEY = '@nutriscan_onboarding';

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [categories, setCategories] = useState<FavoriteCategory[]>(DEFAULT_FAVORITE_CATEGORIES);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Charger les données persistées au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedHistory, savedFavorites, savedCategories, savedOnboarding] = await Promise.all([
          AsyncStorage.getItem(HISTORY_KEY),
          AsyncStorage.getItem(FAVORITES_KEY),
          AsyncStorage.getItem(CATEGORIES_KEY),
          AsyncStorage.getItem(ONBOARDING_KEY),
        ]);
        if (savedHistory) setHistory(JSON.parse(savedHistory));
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        if (savedCategories) setCategories(JSON.parse(savedCategories));
        if (savedOnboarding === 'true') setHasSeenOnboarding(true);
      } catch (error) {
        console.error('Erreur chargement données:', error);
      }
    };
    loadData();
  }, []);

  // ==================== HISTORIQUE ====================

  const addToHistory = useCallback((product: Product) => {
    const entry: HistoryEntry = { product, scannedAt: new Date().toISOString() };
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.product.code !== product.code);
      const updated = [entry, ...filtered];
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((barcode: string) => {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.product.code !== barcode);
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([]));
  }, []);

  // ==================== FAVORIS ====================

  const addToFavorites = useCallback((product: Product, category: string) => {
    const entry: FavoriteEntry = {
      product,
      category: category || 'uncategorized',
      addedAt: new Date().toISOString(),
    };
    setFavorites((prev) => {
      const filtered = prev.filter((f) => f.product.code !== product.code);
      const updated = [entry, ...filtered];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  const removeFromFavorites = useCallback((barcode: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.product.code !== barcode);
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  const moveFavorite = useCallback((barcode: string, newCategory: string) => {
    setFavorites((prev) => {
      const updated = prev.map((f) =>
        f.product.code === barcode ? { ...f, category: newCategory } : f
      );
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  const isFavorite = useCallback((barcode: string) => {
    return favorites.some((f) => f.product.code === barcode);
  }, [favorites]);

  // ==================== CATÉGORIES ====================

  const addCategory = useCallback((name: string): boolean => {
    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const exists = categories.some((c) => c.id === id || c.name.toLowerCase() === name.toLowerCase());
    if (exists) return false;
    const newCat: FavoriteCategory = { id, name, isDefault: false };
    const updated = [...categories, newCat];
    setCategories(updated);
    AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated)).catch(console.error);
    return true;
  }, [categories]);

  const removeCategory = useCallback((id: string) => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
    // Déplacer les favoris orphelins vers "Sans catégorie"
    setFavorites((prev) => {
      const updated = prev.map((f) =>
        f.category === id ? { ...f, category: 'uncategorized' } : f
      );
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  // ==================== RESET ====================

  const resetAllData = useCallback(async () => {
    setHistory([]);
    setFavorites([]);
    setCategories(DEFAULT_FAVORITE_CATEGORIES);
    await Promise.all([
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([])),
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([])),
      AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_FAVORITE_CATEGORIES)),
    ]);
  }, []);

  // ==================== ONBOARDING ====================

  const setOnboardingComplete = useCallback(async () => {
    setHasSeenOnboarding(true);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  }, []);

  return (
    <DataContext.Provider
      value={{
        history, addToHistory, removeFromHistory, clearHistory,
        favorites, addToFavorites, removeFromFavorites, moveFavorite, isFavorite,
        categories, addCategory, removeCategory,
        resetAllData,
        hasSeenOnboarding, setOnboardingComplete,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
