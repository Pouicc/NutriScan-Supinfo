/**
 * Composant ProductCard
 * Affiche un aperçu de produit dans une liste (recherche, historique, favoris)
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Product } from '../types';
import NutriScoreBadge from './NutriScoreBadge';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, subtitle, rightAction }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const imageUrl = product.image_front_small_url || product.image_url;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.8}
      >
        {/* Image du produit */}
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>📦</Text>
          </View>
        )}

        {/* Infos produit */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {product.product_name || 'Produit sans nom'}
          </Text>
          {product.brands && (
            <Text style={styles.brand} numberOfLines={1}>
              {product.brands}
            </Text>
          )}
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
          <View style={styles.scoreRow}>
            <NutriScoreBadge grade={product.nutriscore_grade} size="small" />
          </View>
        </View>

        {/* Action droite (ex: bouton supprimer) */}
        {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 28,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  brand: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rightAction: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
});

export default ProductCard;
