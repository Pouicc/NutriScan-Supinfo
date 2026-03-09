/**
 * Types centralisés pour l'application NutriScan
 */

// ==================== PRODUIT ====================

/** Données nutritionnelles pour 100g */
export interface Nutriments {
  'energy-kcal_100g'?: number;
  fat_100g?: number;
  'saturated-fat_100g'?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  fiber_100g?: number;
  proteins_100g?: number;
  salt_100g?: number;
  [key: string]: number | undefined;
}

/** Produit tel que retourné par l'API Open Food Facts */
export interface Product {
  code: string;
  product_name?: string;
  brands?: string;
  quantity?: string;
  image_url?: string;
  image_front_url?: string;
  image_front_small_url?: string;
  nutriscore_grade?: string;
  nova_group?: number;
  ecoscore_grade?: string;
  nutriments?: Nutriments;
  ingredients_text?: string;
  allergens_tags?: string[];
  categories_tags?: string[];
  labels_tags?: string[];
}

// ==================== NAVIGATION ====================

export type RootTabParamList = {
  ScannerTab: undefined;
  SearchTab: undefined;
  HistoryTab: undefined;
  FavoritesTab: undefined;
  SettingsTab: undefined;
};

export type ScannerStackParamList = {
  Scanner: undefined;
  ProductDetail: { barcode: string; product?: Product };
};

export type SearchStackParamList = {
  Search: undefined;
  ProductDetail: { barcode: string; product?: Product };
};

export type HistoryStackParamList = {
  History: undefined;
  ProductDetail: { barcode: string; product?: Product };
};

export type FavoritesStackParamList = {
  Favorites: undefined;
  ProductDetail: { barcode: string; product?: Product };
};

export type SettingsStackParamList = {
  Settings: undefined;
};
