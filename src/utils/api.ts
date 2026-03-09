/**
 * Utilitaire pour les appels à l'API Open Food Facts
 */

import { Product } from '../types';

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
