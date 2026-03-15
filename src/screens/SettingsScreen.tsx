/**
 * Écran Paramètres
 * Dark mode, allergènes, régime alimentaire, langue, réinitialisation, à propos
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { usePreferences } from '../context/PreferencesContext';
import { useData } from '../context/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import { ALLERGENS_LIST, DIETS_LIST, APP_NAME, APP_VERSION } from '../constants/colors';
import { Allergen, DietaryPreference } from '../types';

const SettingsScreen: React.FC = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const { preferences, toggleAllergen, toggleDiet, setLanguage, resetPreferences } = usePreferences();
  const { resetAllData } = useData();
  const { t, lang } = useTranslation();

  const handleReset = () => {
    Alert.alert(
      t('resetAll'),
      t('resetConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          style: 'destructive',
          onPress: () => {
            resetAllData();
            resetPreferences();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* APPARENCE */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('appearance')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Dark Mode */}
        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            <Text style={[styles.settingText, { color: colors.text }]}>{isDark ? t('darkMode') : t('lightMode')}</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D1D5DB', true: colors.primary + '80' }}
            thumbColor={isDark ? colors.primary : '#F3F4F6'}
          />
        </View>

        {/* Langue */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            <Text style={[styles.settingText, { color: colors.text }]}>{t('language')}</Text>
          </View>
          <View style={styles.langButtons}>
            <TouchableOpacity
              style={[
                styles.langButton,
                lang === 'fr' && { backgroundColor: colors.primary },
                { borderColor: colors.border },
              ]}
              onPress={() => setLanguage('fr')}
              activeOpacity={0.7}
            >
              <Text style={[styles.langText, lang === 'fr' && styles.langTextActive]}>
                FR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.langButton,
                lang === 'en' && { backgroundColor: colors.primary },
                { borderColor: colors.border },
              ]}
              onPress={() => setLanguage('en')}
              activeOpacity={0.7}
            >
              <Text style={[styles.langText, lang === 'en' && styles.langTextActive]}>
                EN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* MES ALLERGÈNES */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('myAllergens')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {ALLERGENS_LIST.map((allergen, index) => (
          <React.Fragment key={allergen.key}>
            {index > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => toggleAllergen(allergen.key as Allergen)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  preferences.allergens.includes(allergen.key as Allergen)
                    ? { backgroundColor: colors.error, borderColor: colors.error }
                    : { borderColor: colors.border },
                ]}
              >
                {preferences.allergens.includes(allergen.key as Allergen) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                {lang === 'fr' ? allergen.labelFr : allergen.labelEn}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>

      {/* MON RÉGIME */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('myDiet')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {DIETS_LIST.map((diet, index) => (
          <React.Fragment key={diet.key}>
            {index > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => toggleDiet(diet.key as DietaryPreference)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  preferences.dietaryPreferences.includes(diet.key as DietaryPreference)
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { borderColor: colors.border },
                ]}
              >
                {preferences.dietaryPreferences.includes(diet.key as DietaryPreference) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                {lang === 'fr' ? diet.labelFr : diet.labelEn}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>

      {/* DONNÉES */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('data')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={styles.dangerRow}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={[styles.dangerText, { color: colors.error }]}>{t('resetAll')}</Text>
        </TouchableOpacity>
      </View>

      {/* À PROPOS */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('about')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>{APP_NAME}</Text>
          <Text style={[styles.aboutValue, { color: colors.text }]}>{t('version')} {APP_VERSION}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutValue, { color: colors.textSecondary }]}>
            {t('apiCredits')}
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
  },
  langButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  langButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  langText: {
    fontSize: 14,
    fontWeight: '500',
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  dangerIcon: {
    fontSize: 20,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  aboutRow: {
    padding: 14,
  },
  aboutLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  aboutValue: {
    fontSize: 14,
  },
});

export default SettingsScreen;
