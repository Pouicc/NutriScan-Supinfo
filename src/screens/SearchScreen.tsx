/**
 * Écran Recherche
 * Barre de recherche avec debounce, résultats en FlatList, pagination infinie
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchStackParamList, Product } from '../types';
import { useProductSearch } from '../hooks/useProductSearch';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<SearchStackParamList, 'Search'>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [query, setQuery] = useState('');
  const { results, loading, error, searchMore, hasMore, totalCount } = useProductSearch(query);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { barcode: product.code, product });
  };

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
    />
  );

  const renderFooter = () => {
    if (!loading || results.length === 0) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color="#4CAF50" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un produit..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Text
              style={styles.clearButton}
              onPress={() => setQuery('')}
            >
              ✕
            </Text>
          )}
        </View>
        {totalCount > 0 && (
          <Text style={styles.resultCount}>
            {totalCount} résultats
          </Text>
        )}
      </View>

      {/* Contenu */}
      {error ? (
        <EmptyState icon="⚠️" title="Erreur" message={error} />
      ) : query.length < 2 ? (
        <EmptyState
          icon="🔍"
          title="Recherche"
          message="Tapez au moins 2 caractères pour rechercher un produit par nom ou marque"
        />
      ) : loading && results.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Recherche en cours...</Text>
        </View>
      ) : results.length === 0 ? (
        <EmptyState icon="😕" title="Aucun résultat" message="Essayez avec d'autres mots-clés" />
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.code}
          onEndReached={searchMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
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
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  clearButton: {
    fontSize: 18,
    color: '#999',
    padding: 4,
  },
  resultCount: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
    marginLeft: 4,
  },
  listContent: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});

export default SearchScreen;
