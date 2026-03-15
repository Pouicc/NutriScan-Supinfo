/**
 * Configuration de la navigation
 * Tab Navigator (5 onglets) + Stack Navigator par onglet
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

import {
  RootTabParamList,
  ScannerStackParamList,
  SearchStackParamList,
  HistoryStackParamList,
  DashboardStackParamList,
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
import ComparatorScreen from '../screens/ComparatorScreen';
import DashboardScreen from '../screens/DashboardScreen';

// ==================== STACK NAVIGATORS ====================

const ScannerStackNav = createNativeStackNavigator<ScannerStackParamList>();
const SearchStackNav = createNativeStackNavigator<SearchStackParamList>();
const HistoryStackNav = createNativeStackNavigator<HistoryStackParamList>();
const DashboardStackNav = createNativeStackNavigator<DashboardStackParamList>();
const FavoritesStackNav = createNativeStackNavigator<FavoritesStackParamList>();
const SettingsStackNav = createNativeStackNavigator<SettingsStackParamList>();

const Tab = createBottomTabNavigator<RootTabParamList>();

// Animation de transition slide horizontal pour les stacks
const slideTransition = {
  animation: 'slide_from_right' as const,
};

function ScannerStackNavigator() {
  const { colors } = useTheme();
  return (
    <ScannerStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        ...slideTransition,
      }}
    >
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
      <ScannerStackNav.Screen
        name="Comparator"
        component={ComparatorScreen}
        options={{ title: 'Comparateur' }}
      />
    </ScannerStackNav.Navigator>
  );
}

function SearchStackNavigator() {
  const { colors } = useTheme();
  return (
    <SearchStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        ...slideTransition,
      }}
    >
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
      <SearchStackNav.Screen
        name="Comparator"
        component={ComparatorScreen}
        options={{ title: 'Comparateur' }}
      />
    </SearchStackNav.Navigator>
  );
}

function HistoryStackNavigator() {
  const { colors } = useTheme();
  return (
    <HistoryStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        ...slideTransition,
      }}
    >
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
      <HistoryStackNav.Screen
        name="Comparator"
        component={ComparatorScreen}
        options={{ title: 'Comparateur' }}
      />
    </HistoryStackNav.Navigator>
  );
}

function FavoritesStackNavigator() {
  const { colors } = useTheme();
  return (
    <FavoritesStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        ...slideTransition,
      }}
    >
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
      <FavoritesStackNav.Screen
        name="Comparator"
        component={ComparatorScreen}
        options={{ title: 'Comparateur' }}
      />
    </FavoritesStackNav.Navigator>
  );
}

function DashboardStackNavigator() {
  const { colors } = useTheme();
  return (
    <DashboardStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <DashboardStackNav.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
    </DashboardStackNav.Navigator>
  );
}

function SettingsStackNavigator() {
  const { colors } = useTheme();
  return (
    <SettingsStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
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
  <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.6, marginBottom: -4 }}>
    {emoji}
  </Text>
);

// ==================== MAIN NAVIGATOR ====================

const AppNavigator: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Platform.OS === 'ios' ? 20 : 24,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 88 : 88,
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
            tabBarLabel: t('scanner'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="📷" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStackNavigator}
          options={{
            tabBarLabel: t('search'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="🔍" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="HistoryTab"
          component={HistoryStackNavigator}
          options={{
            tabBarLabel: t('history'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="📋" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="FavoritesTab"
          component={FavoritesStackNavigator}
          options={{
            tabBarLabel: t('favorites'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="⭐" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="DashboardTab"
          component={DashboardStackNavigator}
          options={{
            tabBarLabel: t('dashboard'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="📊" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsStackNavigator}
          options={{
            tabBarLabel: t('settings'),
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
