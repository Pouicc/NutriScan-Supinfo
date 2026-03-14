/**
 * Écran Historique
 * Liste des produits scannés, ordre chronologique inverse
 * Persisté entre les sessions via AsyncStorage
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HistoryStackParamList, HistoryEntry } from '../types';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<HistoryStackParamList, 'History'>;

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { history, removeFromHistory, clearHistory } = useData();

  const handleProductPress = (entry: HistoryEntry) => {
    navigation.navigate('ProductDetail', {
      barcode: entry.product.code,
      product: entry.product,
    });
  };

  const handleDelete = (barcode: string) => {
    removeFromHistory(barcode);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Vider l\'historique',
      'Êtes-vous sûr de vouloir supprimer tout l\'historique ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Confirmer', style: 'destructive', onPress: clearHistory },
      ]
    );
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: HistoryEntry }) => (
    <ProductCard
      product={item.product}
      onPress={() => handleProductPress(item)}
      subtitle={`Scanné le ${formatDate(item.scannedAt)}`}
      rightAction={
        <TouchableOpacity
          onPress={() => handleDelete(item.product.code)}
          style={styles.deleteButton}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      }
    />
  );

  return (
    <View style={styles.container}>
      {/* Bouton vider l'historique */}
      {history.length > 0 && (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <Text style={styles.clearBtnIcon}>🗑️</Text>
            <Text style={styles.clearBtnText}>Vider l'historique</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Liste ou état vide */}
      {history.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Historique vide"
          message="Les produits que vous scannez apparaîtront ici automatiquement"
        />
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.product.code}_${item.scannedAt}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    gap: 6,
  },
  clearBtnIcon: {
    fontSize: 16,
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F44336',
  },
  listContent: {
    paddingBottom: 20,
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 20,
  },
});

export default HistoryScreen;
