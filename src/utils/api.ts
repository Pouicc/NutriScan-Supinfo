/**
 * Utilitaire pour les appels à l'API Open Food Facts
 */

import { Product, SearchResult } from '../types';

const API_BASE_URL = 'https://world.openfoodfacts.org';
const USER_AGENT = 'NutriScanSUPINFO/1.0 (contact@supinfo.com)';

const defaultHeaders = {
  'User-Agent': USER_AGENT,
  Accept: 'application/json',
};

/**
 * Récupère un produit par son code-barres
 */
export const fetchProductByBarcode = async (barcode: string): Promise<Product | null> => {
  const response = await fetch(`${API_BASE_URL}/api/v2/product/${encodeURIComponent(barcode)}.json`, {
    headers: defaultHeaders,
  });

  if (!response.ok) {
    throw new Error(`Erreur réseau : ${response.status}`);
  }

  const data = await response.json();

  if (data.status === 0 || !data.product) {
    return null;
  }

  return {
    code: barcode,
    product_name: data.product.product_name,
    brands: data.product.brands,
    quantity: data.product.quantity,
    image_url: data.product.image_url,
    image_front_url: data.product.image_front_url,
    image_front_small_url: data.product.image_front_small_url,
    nutriscore_grade: data.product.nutriscore_grade,
    nova_group: data.product.nova_group,
    ecoscore_grade: data.product.ecoscore_grade,
    nutriments: data.product.nutriments,
    ingredients_text: data.product.ingredients_text,
    allergens_tags: data.product.allergens_tags,
    categories_tags: data.product.categories_tags,
    labels_tags: data.product.labels_tags,
  };
};

/**
 * Recherche de produits par mots-clés
 * GET /cgi/search.pl?search_terms=…&json=1
 */
export const searchProducts = async (
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<SearchResult> => {
  const params = new URLSearchParams({
    search_terms: query,
    json: '1',
    page: String(page),
    page_size: String(pageSize),
    fields: 'code,product_name,brands,quantity,image_front_small_url,image_url,nutriscore_grade,nova_group,ecoscore_grade,nutriments,ingredients_text,allergens_tags,categories_tags,labels_tags',
  });

  const response = await fetch(`${API_BASE_URL}/cgi/search.pl?${params.toString()}`, {
    headers: defaultHeaders,
  });

  if (!response.ok) {
    throw new Error(`Erreur réseau : ${response.status}`);
  }

  const data = await response.json();

  return {
    count: data.count || 0,
    page: data.page || page,
    page_count: data.page_count || 0,
    page_size: data.page_size || pageSize,
    products: (data.products || []).map((p: any) => ({
      code: p.code,
      product_name: p.product_name,
      brands: p.brands,
      quantity: p.quantity,
      image_url: p.image_url,
      image_front_url: p.image_front_url,
      image_front_small_url: p.image_front_small_url,
      nutriscore_grade: p.nutriscore_grade,
      nova_group: p.nova_group,
      ecoscore_grade: p.ecoscore_grade,
      nutriments: p.nutriments,
      ingredients_text: p.ingredients_text,
      allergens_tags: p.allergens_tags,
      categories_tags: p.categories_tags,
      labels_tags: p.labels_tags,
    })),
  };
};

/**
 * Formate une valeur nutritionnelle avec unité
 */
export const formatNutrient = (value?: number, unit: string = 'g'): string => {
  if (value === undefined || value === null) return '—';
  if (unit === 'kcal') return `${Math.round(value)} kcal`;
  return `${value.toFixed(1)} ${unit}`;
};
