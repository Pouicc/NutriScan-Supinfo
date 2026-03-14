/**
 * Écran Comparateur
 * Compare deux produits côte à côte avec code couleur vert/rouge
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ScannerStackParamList, Product, HistoryEntry } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import { formatNutrient } from '../utils/api';
import NutriScoreBadge from '../components/NutriScoreBadge';
import ProductCard from '../components/ProductCard';

type RouteProps = RouteProp<ScannerStackParamList, 'Comparator'>;

interface ComparisonRow {
  label: string;
  value1: number | undefined;
  value2: number | undefined;
  unit: string;
  lowerIsBetter: boolean;
}

const ComparatorScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const { colors } = useTheme();
  const { history } = useData();
  const { t } = useTranslation();

  const [product1] = useState<Product>(route.params.product1);
  const [product2, setProduct2] = useState<Product | null>(route.params.product2 || null);
  const [showPicker, setShowPicker] = useState(!route.params.product2);

  // Critères de comparaison
  const getComparisonData = (): ComparisonRow[] => {
    if (!product2) return [];
    return [
      {
        label: t('calories'),
        value1: product1.nutriments?.['energy-kcal_100g'],
        value2: product2.nutriments?.['energy-kcal_100g'],
        unit: 'kcal',
        lowerIsBetter: true,
      },
      {
        label: t('fat'),
        value1: product1.nutriments?.fat_100g,
        value2: product2.nutriments?.fat_100g,
        unit: 'g',
        lowerIsBetter: true,
      },
      {
        label: t('saturatedFat'),
        value1: product1.nutriments?.['saturated-fat_100g'],
        value2: product2.nutriments?.['saturated-fat_100g'],
        unit: 'g',
        lowerIsBetter: true,
      },
      {
        label: t('sugars'),
        value1: product1.nutriments?.sugars_100g,
        value2: product2.nutriments?.sugars_100g,
        unit: 'g',
        lowerIsBetter: true,
      },
      {
        label: t('salt'),
        value1: product1.nutriments?.salt_100g,
        value2: product2.nutriments?.salt_100g,
        unit: 'g',
        lowerIsBetter: true,
      },
      {
        label: t('fiber'),
        value1: product1.nutriments?.fiber_100g,
        value2: product2.nutriments?.fiber_100g,
        unit: 'g',
        lowerIsBetter: false,
      },
      {
        label: t('proteins'),
        value1: product1.nutriments?.proteins_100g,
        value2: product2.nutriments?.proteins_100g,
        unit: 'g',
        lowerIsBetter: false,
      },
    ];
  };

  // Calculer le gagnant global
  const getWinner = (): 0 | 1 | 2 => {
    if (!product2) return 0;
    const rows = getComparisonData();
    let score1 = 0;
    let score2 = 0;

    rows.forEach((row) => {
      if (row.value1 !== undefined && row.value2 !== undefined) {
        if (row.lowerIsBetter) {
          if (row.value1 < row.value2) score1++;
          else if (row.value2 < row.value1) score2++;
        } else {
          if (row.value1 > row.value2) score1++;
          else if (row.value2 > row.value1) score2++;
        }
      }
    });

    if (score1 > score2) return 1;
    if (score2 > score1) return 2;
    return 0;
  };

  // Couleur selon le résultat du critère
  const getCellColor = (row: ComparisonRow, side: 1 | 2): string => {
    const val = side === 1 ? row.value1 : row.value2;
    const otherVal = side === 1 ? row.value2 : row.value1;
    if (val === undefined || otherVal === undefined) return 'transparent';

    if (row.lowerIsBetter) {
      if (val < otherVal) return colors.success + '20';
      if (val > otherVal) return colors.error + '20';
    } else {
      if (val > otherVal) return colors.success + '20';
      if (val < otherVal) return colors.error + '20';
    }
    return 'transparent';
  };

  const selectProduct = (product: Product) => {
    setProduct2(product);
    setShowPicker(false);
  };

  const winner = getWinner();
  const comparisonData = getComparisonData();

  // Affichage d'un produit (colonne)
  const renderProductColumn = (product: Product | null) => {
    if (!product) return null;
    const imageUrl = product.image_front_small_url || product.image_url;
    return (
      <View style={styles.productColumn}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="cover" />
        ) : (
          <View style={[styles.productImage, styles.placeholderImage]}>
            <Text style={{ fontSize: 28 }}>📦</Text>
          </View>
        )}
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
          {product.product_name || t('unknown')}
        </Text>
        <NutriScoreBadge grade={product.nutriscore_grade} size="small" />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* En-tête des deux produits */}
        <View style={styles.productsHeader}>
          {renderProductColumn(product1)}
          <View style={styles.vsContainer}>
            <Text style={[styles.vsText, { color: colors.accent }]}>{t('vsLabel')}</Text>
          </View>
          {product2 ? (
            renderProductColumn(product2)
          ) : (
            <TouchableOpacity
              style={[styles.selectButton, { borderColor: colors.primary }]}
              onPress={() => setShowPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.selectButtonText, { color: colors.primary }]}>
                + {t('selectProduct')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tableau comparatif */}
        {product2 && (
          <View style={styles.comparisonTable}>
            {comparisonData.map((row, index) => (
              <View
                key={row.label}
                style={[
                  styles.comparisonRow,
                  index % 2 === 0 && { backgroundColor: colors.card },
                ]}
              >
                <View style={[styles.comparisonCell, { backgroundColor: getCellColor(row, 1) }]}>
                  <Text style={[styles.cellValue, { color: colors.text }]}>
                    {formatNutrient(row.value1, row.unit)}
                  </Text>
                </View>
                <View style={[styles.comparisonLabel, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.labelText, { color: colors.textSecondary }]} numberOfLines={1}>
                    {row.label}
                  </Text>
                </View>
                <View style={[styles.comparisonCell, { backgroundColor: getCellColor(row, 2) }]}>
                  <Text style={[styles.cellValue, { color: colors.text }]}>
                    {formatNutrient(row.value2, row.unit)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Résumé du gagnant */}
        {product2 && (
          <View style={[styles.winnerSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.winnerIcon}>
              {winner === 0 ? '🤝' : '🏆'}
            </Text>
            <Text style={[styles.winnerText, { color: colors.text }]}>
              {winner === 1
                ? t('product1Wins')
                : winner === 2
                  ? t('product2Wins')
                  : t('itsATie')}
            </Text>
          </View>
        )}

        {/* Bouton pour changer le produit 2 */}
        {product2 && (
          <TouchableOpacity
            style={[styles.changeButton, { borderColor: colors.primary }]}
            onPress={() => setShowPicker(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.changeButtonText, { color: colors.primary }]}>
              {t('selectFromHistory')}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal de sélection de produit depuis l'historique */}
      <Modal visible={showPicker} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('selectFromHistory')}
            </Text>
            <TouchableOpacity onPress={() => setShowPicker(false)} activeOpacity={0.7}>
              <Text style={[styles.modalClose, { color: colors.primary }]}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={history.filter((h) => h.product.code !== product1.code)}
            renderItem={({ item }: { item: HistoryEntry }) => (
              <ProductCard
                product={item.product}
                onPress={() => selectProduct(item.product)}
              />
            )}
            keyExtractor={(item) => item.product.code}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  productColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  placeholderImage: {
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  vsContainer: {
    paddingHorizontal: 12,
    paddingTop: 30,
  },
  vsText: {
    fontSize: 20,
    fontWeight: '800',
  },
  selectButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  selectButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  comparisonTable: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonCell: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  cellValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  comparisonLabel: {
    width: 100,
    padding: 10,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  winnerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginBottom: 16,
  },
  winnerIcon: {
    fontSize: 28,
  },
  winnerText: {
    fontSize: 17,
    fontWeight: '700',
  },
  changeButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  changeButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ComparatorScreen;
