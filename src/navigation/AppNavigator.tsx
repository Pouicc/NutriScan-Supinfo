/**
 * Configuration de la navigation
 * Tab Navigator (5 onglets) + Stack Navigator par onglet
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';

import {
  RootTabParamList,
  ScannerStackParamList,
  SearchStackParamList,
  HistoryStackParamList,
  FavoritesStackParamList,
  SettingsStackParamList,
} from '../types';

// Screens
import ScannerScreen from '../screens/ScannerScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import HistoryScreen from '../screens/HistoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

// ==================== STACK NAVIGATORS ====================

const ScannerStackNav = createNativeStackNavigator<ScannerStackParamList>();
const SearchStackNav = createNativeStackNavigator<SearchStackParamList>();
const HistoryStackNav = createNativeStackNavigator<HistoryStackParamList>();
const FavoritesStackNav = createNativeStackNavigator<FavoritesStackParamList>();
const SettingsStackNav = createNativeStackNavigator<SettingsStackParamList>();

const Tab = createBottomTabNavigator<RootTabParamList>();

function ScannerStackNavigator() {
  return (
    <ScannerStackNav.Navigator>
      <ScannerStackNav.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ title: 'Scanner', headerShown: false }}
      />
      <ScannerStackNav.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Détail produit' }}
      />
    </ScannerStackNav.Navigator>
  );
}

function SearchStackNavigator() {
  return (
    <SearchStackNav.Navigator>
      <SearchStackNav.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Recherche' }}
      />
      <SearchStackNav.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Détail produit' }}
      />
    </SearchStackNav.Navigator>
  );
}

function HistoryStackNavigator() {
  return (
    <HistoryStackNav.Navigator>
      <HistoryStackNav.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Historique' }}
      />
      <HistoryStackNav.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Détail produit' }}
      />
    </HistoryStackNav.Navigator>
  );
}

function FavoritesStackNavigator() {
  return (
    <FavoritesStackNav.Navigator>
      <FavoritesStackNav.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favoris' }}
      />
      <FavoritesStackNav.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Détail produit' }}
      />
    </FavoritesStackNav.Navigator>
  );
}

function SettingsStackNavigator() {
  return (
    <SettingsStackNav.Navigator>
      <SettingsStackNav.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Paramètres' }}
      />
    </SettingsStackNav.Navigator>
  );
}

// ==================== TAB ICON ====================

const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean; color: string }) => (
  <Text style={{ fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.6 }}>
    {emoji}
  </Text>
);

// ==================== MAIN NAVIGATOR ====================

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#e0e0e0',
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 88 : 68,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="ScannerTab"
          component={ScannerStackNavigator}
          options={{
            tabBarLabel: 'Scanner',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="📷" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStackNavigator}
          options={{
            tabBarLabel: 'Recherche',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="🔍" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="HistoryTab"
          component={HistoryStackNavigator}
          options={{
            tabBarLabel: 'Historique',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="📋" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="FavoritesTab"
          component={FavoritesStackNavigator}
          options={{
            tabBarLabel: 'Favoris',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="⭐" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsStackNavigator}
          options={{
            tabBarLabel: 'Paramètres',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="⚙️" focused={focused} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
