/**
 * Contexte de données : historique des scans
 * Persisté via AsyncStorage entre les sessions
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, HistoryEntry } from '../types';

interface DataContextType {
  history: HistoryEntry[];
  addToHistory: (product: Product) => void;
  removeFromHistory: (barcode: string) => void;
  clearHistory: () => void;
  resetAllData: () => void;
}

const DataContext = createContext<DataContextType>({
  history: [],
  addToHistory: () => {},
  removeFromHistory: () => {},
  clearHistory: () => {},
  resetAllData: () => {},
});

const HISTORY_KEY = '@nutriscan_history';

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Charger l'historique persisté au démarrage
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await AsyncStorage.getItem(HISTORY_KEY);
        if (saved) {
          setHistory(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Erreur chargement historique:', error);
      }
    };
    loadHistory();
  }, []);

  // Ajouter un produit à l'historique (doublon = remise en tête)
  const addToHistory = useCallback((product: Product) => {
    const entry: HistoryEntry = {
      product,
      scannedAt: new Date().toISOString(),
    };
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.product.code !== product.code);
      const updated = [entry, ...filtered];
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  // Supprimer une entrée de l'historique
  const removeFromHistory = useCallback((barcode: string) => {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.product.code !== barcode);
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  // Vider tout l'historique
  const clearHistory = useCallback(async () => {
    setHistory([]);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([]));
  }, []);

  // Réinitialiser toutes les données
  const resetAllData = useCallback(async () => {
    setHistory([]);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([]));
  }, []);

  return (
    <DataContext.Provider value={{ history, addToHistory, removeFromHistory, clearHistory, resetAllData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
