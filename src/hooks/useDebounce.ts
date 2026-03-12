/**
 * Hook useDebounce : attend X ms après la dernière frappe avant de retourner la valeur
 * Évite de déclencher une requête API à chaque caractère tapé
 */

import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Annuler le timer si la valeur change avant le délai
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
