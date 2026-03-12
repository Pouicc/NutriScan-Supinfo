/**
 * Composant NutriScoreBadge
 * Affiche le Nutri-Score (A à E) avec un code couleur visuel
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NUTRISCORE_COLORS: Record<string, string> = {
  a: '#038141',
  b: '#85BB2F',
  c: '#FECB02',
  d: '#EE8100',
  e: '#E63E11',
};

interface NutriScoreBadgeProps {
  grade?: string;
  size?: 'small' | 'medium' | 'large';
}

const SIZES = {
  small: { badge: 24, font: 12, bar: 18 },
  medium: { badge: 36, font: 18, bar: 28 },
  large: { badge: 48, font: 24, bar: 36 },
};

const GRADES = ['a', 'b', 'c', 'd', 'e'];

const NutriScoreBadge: React.FC<NutriScoreBadgeProps> = ({ grade, size = 'medium' }) => {
  const normalizedGrade = grade?.toLowerCase() || '';
  const dims = SIZES[size];

  if (!normalizedGrade || !GRADES.includes(normalizedGrade)) {
    return (
      <View style={[styles.unknownBadge, { height: dims.badge, paddingHorizontal: dims.badge / 2 }]}>
        <Text style={[styles.unknownText, { fontSize: dims.font * 0.7 }]}>?</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {GRADES.map((g) => {
        const isActive = g === normalizedGrade;
        const color = NUTRISCORE_COLORS[g];
        return (
          <View
            key={g}
            style={[
              styles.gradeBox,
              {
                backgroundColor: isActive ? color : `${color}30`,
                height: dims.bar,
                width: dims.bar,
                borderRadius: dims.bar / 6,
              },
              isActive && {
                transform: [{ scale: 1.2 }],
                elevation: 4,
                shadowColor: color,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
              },
            ]}
          >
            <Text
              style={[
                styles.gradeText,
                {
                  fontSize: dims.font * 0.7,
                  color: isActive ? '#FFFFFF' : `${color}80`,
                  fontWeight: isActive ? '800' : '600',
                },
              ]}
            >
              {g.toUpperCase()}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  gradeBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    textAlign: 'center',
  },
  unknownBadge: {
    backgroundColor: '#9CA3AF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unknownText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default NutriScoreBadge;
