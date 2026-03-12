/**
 * Hook useProductSearch : recherche de produits avec debounce
 * Gère les 3 états : loading, error, data + pagination infinie
 */

import { useState, useEffect } from 'react';
import { Product } from '../types';
import { searchProducts } from '../utils/api';
import { useDebounce } from './useDebounce';

interface UseProductSearchResult {
  results: Product[];
  loading: boolean;
  error: string | null;
  searchMore: () => void;
  hasMore: boolean;
  totalCount: number;
}

export const useProductSearch = (query: string): UseProductSearchResult => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce de 500ms sur la recherche
  const debouncedQuery = useDebounce(query, 500);

  // Recherche quand le terme debounced change
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      setError(null);
      setTotalCount(0);
      return;
    }

    const search = async () => {
      setLoading(true);
      setError(null);
      setPage(1);

      try {
        const data = await searchProducts(debouncedQuery, 1);
        setResults(data.products);
        setTotalCount(data.count);
        setHasMore(data.page < data.page_count);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  // Charger plus de résultats (pagination)
  const searchMore = async () => {
    if (loading || !hasMore) return;

    const nextPage = page + 1;
    setLoading(true);

    try {
      const data = await searchProducts(debouncedQuery, nextPage);
      setResults((prev) => [...prev, ...data.products]);
      setPage(nextPage);
      setHasMore(nextPage < data.page_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchMore, hasMore, totalCount };
};
