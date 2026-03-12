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
  StyleSheet,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ScannerStackParamList, Product } from '../types';
import { fetchProductByBarcode } from '../utils/api';
import { formatNutrient } from '../utils/api';
import NutriScoreBadge from '../components/NutriScoreBadge';
import NovaBadge from '../components/NovaBadge';
import LoadingIndicator from '../components/LoadingIndicator';

type RouteProps = RouteProp<ScannerStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const [product, setProduct] = useState<Product | null>(route.params.product || null);
  const [loading, setLoading] = useState(!route.params.product);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!route.params.product) {
      loadProduct();
    }
  }, [route.params.barcode]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await fetchProductByBarcode(route.params.barcode);
      if (!p) {
        setError('Produit non trouvé dans la base Open Food Facts.');
      } else {
        setProduct(p);
      }
    } catch (err) {
      setError('Erreur réseau. Vérifiez votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator fullscreen message="Chargement du produit..." />;
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error || 'Produit introuvable.'}</Text>
      </View>
    );
  }

  const imageUrl = product.image_url || product.image_front_url;
  const nutriments = product.nutriments;

  const nutritionData = [
    { label: 'Énergie', value: formatNutrient(nutriments?.['energy-kcal_100g'], 'kcal') },
    { label: 'Matières grasses', value: formatNutrient(nutriments?.fat_100g) },
    { label: 'Acides gras saturés', value: formatNutrient(nutriments?.['saturated-fat_100g']), indent: true },
    { label: 'Glucides', value: formatNutrient(nutriments?.carbohydrates_100g) },
    { label: 'Sucres', value: formatNutrient(nutriments?.sugars_100g), indent: true },
    { label: 'Fibres', value: formatNutrient(nutriments?.fiber_100g) },
    { label: 'Protéines', value: formatNutrient(nutriments?.proteins_100g) },
    { label: 'Sel', value: formatNutrient(nutriments?.salt_100g) },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Image du produit */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="contain" />
      ) : (
        <View style={[styles.productImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>📦</Text>
          <Text style={styles.placeholderLabel}>Pas d'image disponible</Text>
        </View>
      )}

      {/* Nom, marque, quantité */}
      <View style={styles.headerSection}>
        <Text style={styles.productName}>
          {product.product_name || 'Produit sans nom'}
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
          <Text style={styles.scoreLabel}>NUTRI-SCORE</Text>
          <NutriScoreBadge grade={product.nutriscore_grade} size="large" />
        </View>

        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>GROUPE NOVA</Text>
          <NovaBadge group={product.nova_group} showDescription size="medium" />
        </View>
      </View>

      {/* Tableau nutritionnel */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Valeurs nutritionnelles (pour 100g)</Text>
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
          <Text style={styles.sectionTitle}>Ingrédients</Text>
          <Text style={styles.ingredientsText}>{product.ingredients_text}</Text>
        </View>
      )}

      {/* Allergènes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Allergènes</Text>
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
          <Text style={styles.noAllergens}>Aucun allergène déclaré.</Text>
        )}
      </View>

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
