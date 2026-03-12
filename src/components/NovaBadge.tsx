/**
 * Composant NovaBadge
 * Affiche le groupe NOVA (1 à 4) avec sa signification
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NOVA_COLORS: Record<number, string> = {
  1: '#038141',
  2: '#85BB2F',
  3: '#EE8100',
  4: '#E63E11',
};

const NOVA_DESCRIPTIONS: Record<number, string> = {
  1: 'Aliments non transformés ou peu transformés',
  2: 'Ingrédients culinaires transformés',
  3: 'Aliments transformés',
  4: 'Produits alimentaires ultra-transformés',
};

interface NovaBadgeProps {
  group?: number;
  showDescription?: boolean;
  size?: 'small' | 'medium';
}

const NovaBadge: React.FC<NovaBadgeProps> = ({ group, showDescription = false, size = 'medium' }) => {
  const isSmall = size === 'small';

  if (!group || group < 1 || group > 4) {
    return (
      <View style={[styles.badge, styles.unknownBadge, isSmall && styles.badgeSmall]}>
        <Text style={[styles.badgeText, isSmall && styles.badgeTextSmall]}>NOVA ?</Text>
      </View>
    );
  }

  const color = NOVA_COLORS[group];
  const description = NOVA_DESCRIPTIONS[group];

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: color }, isSmall && styles.badgeSmall]}>
        <Text style={[styles.badgeText, isSmall && styles.badgeTextSmall]}>
          NOVA {group}
        </Text>
      </View>
      {showDescription && description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unknownBadge: {
    backgroundColor: '#9CA3AF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  badgeTextSmall: {
    fontSize: 11,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});

export default NovaBadge;
