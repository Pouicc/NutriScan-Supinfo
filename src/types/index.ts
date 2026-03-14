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

// ==================== HISTORIQUE ====================

/** Entrée d'historique : produit + date de scan */
export interface HistoryEntry {
  product: Product;
  scannedAt: string; // ISO date string
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

// ==================== THÈME ====================

/** Couleurs d'un thème (clair ou sombre) */
export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
}

// ==================== ALLERGÈNES & RÉGIMES ====================

/** Allergène prédéfini */
export type Allergen =
  | 'gluten'
  | 'milk'
  | 'eggs'
  | 'peanuts'
  | 'nuts'
  | 'soy'
  | 'fish'
  | 'crustaceans'
  | 'sesame'
  | 'sulphites'
  | 'celery'
  | 'mustard'
  | 'lupin';

/** Régime alimentaire */
export type DietaryPreference =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'halal'
  | 'kosher';

/** Préférences utilisateur */
export interface UserPreferences {
  allergens: Allergen[];
  dietaryPreferences: DietaryPreference[];
  language: 'fr' | 'en';
}

// ==================== RECHERCHE ====================

/** Résultat paginé de l'API Search */
export interface SearchResult {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: Product[];
}
