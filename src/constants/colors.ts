/**
 * Palette de couleurs pour le thème clair et sombre
 * Constantes partagées dans toute l'application
 */

import { ThemeColors, FavoriteCategory } from '../types';

// Couleurs Nutri-Score
export const NUTRISCORE_COLORS: Record<string, string> = {
  a: '#038141',
  b: '#85BB2F',
  c: '#FECB02',
  d: '#EE8100',
  e: '#E63E11',
};

// Couleurs NOVA
export const NOVA_COLORS: Record<number, string> = {
  1: '#038141',
  2: '#85BB2F',
  3: '#EE8100',
  4: '#E63E11',
};

// Thème clair
export const LIGHT_THEME: ThemeColors = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#4CAF50',
  accent: '#FF9800',
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
};

// Thème sombre
export const DARK_THEME: ThemeColors = {
  background: '#0B0D17',
  surface: '#1B1D2A',
  card: '#1E2030',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#2D3348',
  primary: '#66BB6A',
  accent: '#FFB74D',
  error: '#F87171',
  success: '#4ADE80',
  warning: '#FBBF24',
};

// Constantes de l'application
export const APP_NAME = 'NutriScan';
export const APP_VERSION = '1.0.0';

// Liste des allergènes prédéfinis avec traductions
export const ALLERGENS_LIST = [
  { key: 'gluten', labelFr: 'Gluten', labelEn: 'Gluten', tag: 'en:gluten' },
  { key: 'milk', labelFr: 'Lait', labelEn: 'Milk', tag: 'en:milk' },
  { key: 'eggs', labelFr: 'Œufs', labelEn: 'Eggs', tag: 'en:eggs' },
  { key: 'peanuts', labelFr: 'Arachides', labelEn: 'Peanuts', tag: 'en:peanuts' },
  { key: 'nuts', labelFr: 'Fruits à coque', labelEn: 'Nuts', tag: 'en:nuts' },
  { key: 'soy', labelFr: 'Soja', labelEn: 'Soy', tag: 'en:soybeans' },
  { key: 'fish', labelFr: 'Poisson', labelEn: 'Fish', tag: 'en:fish' },
  { key: 'crustaceans', labelFr: 'Crustacés', labelEn: 'Crustaceans', tag: 'en:crustaceans' },
  { key: 'sesame', labelFr: 'Sésame', labelEn: 'Sesame', tag: 'en:sesame-seeds' },
  { key: 'sulphites', labelFr: 'Sulfites', labelEn: 'Sulphites', tag: 'en:sulphur-dioxide-and-sulphites' },
  { key: 'celery', labelFr: 'Céleri', labelEn: 'Celery', tag: 'en:celery' },
  { key: 'mustard', labelFr: 'Moutarde', labelEn: 'Mustard', tag: 'en:mustard' },
  { key: 'lupin', labelFr: 'Lupin', labelEn: 'Lupin', tag: 'en:lupin' },
] as const;

// Catégories de favoris par défaut
export const DEFAULT_FAVORITE_CATEGORIES: FavoriteCategory[] = [
  { id: 'uncategorized', name: 'Sans catégorie', isDefault: true },
  { id: 'breakfast', name: 'Petit-déjeuner', isDefault: true },
  { id: 'healthy-snacks', name: 'Snacks sains', isDefault: true },
  { id: 'to-avoid', name: 'À éviter', isDefault: true },
];

// Régimes alimentaires
export const DIETS_LIST = [
  { key: 'vegetarian', labelFr: 'Végétarien', labelEn: 'Vegetarian' },
  { key: 'vegan', labelFr: 'Végan', labelEn: 'Vegan' },
  { key: 'gluten-free', labelFr: 'Sans gluten', labelEn: 'Gluten-free' },
  { key: 'halal', labelFr: 'Halal', labelEn: 'Halal' },
  { key: 'kosher', labelFr: 'Casher', labelEn: 'Kosher' },
] as const;
