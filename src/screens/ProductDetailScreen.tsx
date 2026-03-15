/**
 * Écran Fiche Produit
 * Affiche les informations détaillées d'un produit scanné
 * Photo, Nutri-Score, NOVA, tableau nutritionnel, ingrédients, allergènes
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScannerStackParamList, Product } from '../types';
import { fetchProductByBarcode } from '../utils/api';
import { formatNutrient } from '../utils/api';
import AnimatedNutriScore from '../components/AnimatedNutriScore';
import NovaBadge from '../components/NovaBadge';
import LoadingIndicator from '../components/LoadingIndicator';
import { useTranslation } from '../hooks/useTranslation';
import { useData } from '../context/DataContext';

type RouteProps = RouteProp<ScannerStackParamList, 'ProductDetail'>;
type NavigationProp = NativeStackNavigationProp<ScannerStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { t, lang } = useTranslation();
  const { addToFavorites, removeFromFavorites, isFavorite, categories } = useData();
  const [product, setProduct] = useState<Product | null>(route.params.product || null);
  const [loading, setLoading] = useState(!route.params.product);
  const [error, setError] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    if (!route.params.product) {
      loadProduct();
    }
  }, [route.params.barcode]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await fetchProductByBarcode(route.params.barcode, lang);
      if (!p) {
        setError(t('productNotFoundMsg'));
      } else {
        setProduct(p);
      }
    } catch (err) {
      setError(t('networkErrorMsg'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    if (isFavorite(product.code)) {
      removeFromFavorites(product.code);
    } else {
      setShowCategoryModal(true);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    if (product) {
      addToFavorites(product, categoryId);
    }
    setShowCategoryModal(false);
  };

  if (loading) {
    return <LoadingIndicator fullscreen message={t('loadingProduct')} />;
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || t('productNotFound')}</Text>
      </View>
    );
  }

  const imageUrl = product.image_url || product.image_front_url;
  const nutriments = product.nutriments;

  const nutritionData = [
    { label: t('energy'), value: formatNutrient(nutriments?.['energy-kcal_100g'], 'kcal') },
    { label: t('fat'), value: formatNutrient(nutriments?.fat_100g) },
    { label: t('saturatedFat'), value: formatNutrient(nutriments?.['saturated-fat_100g']), indent: true },
    { label: t('carbohydrates'), value: formatNutrient(nutriments?.carbohydrates_100g) },
    { label: t('sugars'), value: formatNutrient(nutriments?.sugars_100g), indent: true },
    { label: t('fiber'), value: formatNutrient(nutriments?.fiber_100g) },
    { label: t('proteins'), value: formatNutrient(nutriments?.proteins_100g) },
    { label: t('salt'), value: formatNutrient(nutriments?.salt_100g) },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Image du produit */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="contain" />
      ) : (
        <View style={[styles.productImage, styles.placeholderImage]}>
          <Text style={styles.placeholderLabel}>{t('noImageAvailable')}</Text>
        </View>
      )}

      {/* Nom, marque, quantité */}
      <View style={styles.headerSection}>
        <Text style={styles.productName}>
          {product.product_name || t('unknownProduct')}
        </Text>
        {product.brands && (
          <Text style={styles.productBrand}>{product.brands}</Text>
        )}
        {product.quantity && (
          <Text style={styles.productQuantity}>{product.quantity}</Text>
        )}
      </View>

      {/* Scores : Nutri-Score + NOVA */}
      <View style={styles.scoresSection}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>{t('nutriScore').toUpperCase()}</Text>
          <AnimatedNutriScore grade={product.nutriscore_grade} size="large" />
        </View>

        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>{t('novaGroup').toUpperCase()}</Text>
          <NovaBadge group={product.nova_group} showDescription size="medium" />
        </View>
      </View>

      {/* Tableau nutritionnel */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('nutritionTitle')}</Text>
        {nutritionData.map((row, index) => (
          <View
            key={row.label}
            style={[
              styles.nutritionRow,
              index % 2 === 0 && { backgroundColor: '#F9FAFB' },
            ]}
          >
            <Text
              style={[
                styles.nutritionLabel,
                row.indent && styles.nutritionLabelIndent,
              ]}
            >
              {row.indent ? `  ↳ ${row.label}` : row.label}
            </Text>
            <Text style={styles.nutritionValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      {/* Ingrédients */}
      {product.ingredients_text && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ingredients')}</Text>
          <Text style={styles.ingredientsText}>{product.ingredients_text}</Text>
        </View>
      )}

      {/* Allergènes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('allergens')}</Text>
        {product.allergens_tags && product.allergens_tags.length > 0 ? (
          <View style={styles.allergensList}>
            {product.allergens_tags.map((tag) => {
              const cleanTag = tag.replace('en:', '').replace(/-/g, ' ');
              return (
                <View key={tag} style={styles.allergenChip}>
                  <Text style={styles.allergenChipText}>{cleanTag}</Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.noAllergens}>{t('noAllergensDeclared')}</Text>
        )}
      </View>

      {/* Bouton comparer */}
      <TouchableOpacity
        style={styles.compareButton}
        onPress={() => navigation.navigate('Comparator', { product1: product })}
        activeOpacity={0.7}
      >
        <Text style={styles.compareIcon}>⚖️</Text>
        <Text style={styles.compareText}>{t('compare')}</Text>
      </TouchableOpacity>

      {/* Bouton favori */}
      <TouchableOpacity
        style={[styles.favoriteButton, isFavorite(product.code) && styles.favoriteButtonActive]}
        onPress={handleToggleFavorite}
        activeOpacity={0.7}
      >
        <Text style={styles.favoriteIcon}>{isFavorite(product.code) ? '❤️' : '🤍'}</Text>
        <Text style={[styles.favoriteText, isFavorite(product.code) && styles.favoriteTextActive]}>
          {isFavorite(product.code) ? t('removeFromFavorites') : t('addToFavorites')}
        </Text>
      </TouchableOpacity>

      {/* Modal : Choisir une catégorie */}
      <Modal visible={showCategoryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectCategory')}</Text>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryOption}
                onPress={() => handleSelectCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryOptionText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.modalCancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  productImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#F3F4F6',
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 64,
  },
  placeholderLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  headerSection: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 14,
    color: '#999',
  },
  scoresSection: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  scoreItem: {
    gap: 8,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6B7280',
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  nutritionLabelIndent: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  ingredientsText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  allergensList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergenChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  allergenChipText: {
    fontSize: 13,
    textTransform: 'capitalize',
    color: '#EF4444',
    fontWeight: '600',
  },
  noAllergens: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    gap: 8,
  },
  compareIcon: {
    fontSize: 20,
  },
  compareText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
    gap: 8,
  },
  favoriteButtonActive: {
    backgroundColor: '#FFEBEE',
  },
  favoriteIcon: {
    fontSize: 20,
  },
  favoriteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E57373',
  },
  favoriteTextActive: {
    color: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryOption: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryOptionText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  modalCancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProductDetailScreen;
