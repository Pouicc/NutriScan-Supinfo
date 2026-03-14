/**
 * Écran Favoris avec catégories personnalisées
 * Barre de catégories horizontale, modales pour créer/déplacer
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FavoritesStackParamList } from '../types';
import { useData } from '../context/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import ProductCard from '../components/ProductCard';

type NavigationProp = NativeStackNavigationProp<FavoritesStackParamList, 'Favorites'>;

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const { favorites, removeFromFavorites, moveFavorite, categories, addCategory, removeCategory } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [movingProduct, setMovingProduct] = useState<string | null>(null);
  const [moveCategorySearch, setMoveCategorySearch] = useState('');

  // Filtrer les favoris par catégorie sélectionnée
  const filteredFavorites = useMemo(() => {
    if (!selectedCategory) return favorites;
    return favorites.filter((f) => f.category === selectedCategory);
  }, [favorites, selectedCategory]);

  // Catégories filtrées pour le modal de déplacement
  const filteredMoveCategories = useMemo(() => {
    if (!moveCategorySearch.trim()) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(moveCategorySearch.toLowerCase())
    );
  }, [categories, moveCategorySearch]);

  const handleCreateCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const success = addCategory(name);
    if (!success) {
      Alert.alert('', t('categoryExists'));
      return;
    }
    setNewCategoryName('');
    setShowNewCategoryModal(false);
  };

  const handleDeleteCategory = (id: string) => {
    Alert.alert(t('deleteCategory'), t('deleteCategoryConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: () => removeCategory(id) },
    ]);
  };

  const handleMoveProduct = (barcode: string) => {
    setMovingProduct(barcode);
    setMoveCategorySearch('');
    setShowMoveModal(true);
  };

  const handleSelectMoveCategory = (categoryId: string) => {
    if (movingProduct) {
      moveFavorite(movingProduct, categoryId);
    }
    setShowMoveModal(false);
    setMovingProduct(null);
  };

  // Compte des favoris par catégorie
  const getCategoryCount = (catId: string) => {
    return favorites.filter((f) => f.category === catId).length;
  };

  return (
    <View style={styles.container}>
      {/* Barre de catégories horizontale */}
      <View style={styles.categoryBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: null, name: t('allCategories') }, ...categories]}
          keyExtractor={(item) => item.id || 'all'}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.id;
            const count = item.id ? getCategoryCount(item.id) : favorites.length;
            return (
              <TouchableOpacity
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(item.id)}
                onLongPress={() => {
                  if (item.id && !categories.find((c) => c.id === item.id)?.isDefault) {
                    handleDeleteCategory(item.id);
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                  {item.name} ({count})
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        <TouchableOpacity
          style={styles.addCategoryButton}
          onPress={() => setShowNewCategoryModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.addCategoryIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des favoris */}
      {filteredFavorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>⭐</Text>
          <Text style={styles.emptyTitle}>{t('emptyFavorites')}</Text>
          <Text style={styles.emptySubtitle}>{t('emptyFavoritesMsg')}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.product.code}
          contentContainerStyle={styles.favoritesList}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              <TouchableOpacity
                style={styles.cardWrapper}
                onPress={() =>
                  navigation.navigate('ProductDetail', {
                    barcode: item.product.code,
                    product: item.product,
                  })
                }
                activeOpacity={0.7}
              >
                <ProductCard
                  product={item.product}
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      barcode: item.product.code,
                      product: item.product,
                    })
                  }
                />
              </TouchableOpacity>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.moveButton}
                  onPress={() => handleMoveProduct(item.product.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.moveIcon}>📂</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeFromFavorites(item.product.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal : Nouvelle catégorie */}
      <Modal visible={showNewCategoryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('newCategory')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={t('categoryName')}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
              maxLength={30}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowNewCategoryModal(false);
                  setNewCategoryName('');
                }}
              >
                <Text style={styles.modalCancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmButton, !newCategoryName.trim() && { opacity: 0.5 }]}
                onPress={handleCreateCategory}
                disabled={!newCategoryName.trim()}
              >
                <Text style={styles.modalConfirmText}>{t('create')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal : Déplacer vers catégorie */}
      <Modal visible={showMoveModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('moveToCategory')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={t('searchCategory')}
              value={moveCategorySearch}
              onChangeText={setMoveCategorySearch}
            />
            <ScrollView style={styles.categoryScrollList}>
              {filteredMoveCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryOption}
                  onPress={() => handleSelectMoveCategory(cat.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryOptionText}>{cat.name}</Text>
                  <Text style={styles.categoryOptionCount}>
                    ({getCategoryCount(cat.id)})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setShowMoveModal(false);
                setMovingProduct(null);
              }}
            >
              <Text style={styles.modalCancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  categoryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 10,
  },
  categoryList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  addCategoryButton: {
    marginRight: 12,
    marginLeft: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCategoryIcon: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  favoritesList: {
    padding: 12,
    gap: 8,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardWrapper: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 4,
    marginLeft: 8,
  },
  moveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moveIcon: {
    fontSize: 18,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 18,
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
    maxHeight: '70%',
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
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
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
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryScrollList: {
    maxHeight: 250,
    marginBottom: 12,
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  categoryOptionCount: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});

export default FavoritesScreen;
