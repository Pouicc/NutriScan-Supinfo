/**
 * Composant AnimatedNutriScore
 * Barre animée qui se remplit de A à E et s'arrête sur le score exact
 * L'animation se joue à chaque montage du composant
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { NUTRISCORE_COLORS } from '../constants/colors';

interface AnimatedNutriScoreProps {
  grade?: string;
  size?: 'small' | 'medium' | 'large';
}

const GRADES = ['a', 'b', 'c', 'd', 'e'];

const SIZES = {
  small: { bar: 18, font: 10, gap: 2 },
  medium: { bar: 28, font: 14, gap: 3 },
  large: { bar: 36, font: 18, gap: 4 },
};

const AnimatedNutriScore: React.FC<AnimatedNutriScoreProps> = ({ grade, size = 'medium' }) => {
  const normalizedGrade = grade?.toLowerCase() || '';
  const dims = SIZES[size];
  const targetIndex = GRADES.indexOf(normalizedGrade);

  // Animation : valeur de 0 à targetIndex + 1
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fillAnim.setValue(0);
    if (targetIndex >= 0) {
      Animated.timing(fillAnim, {
        toValue: targetIndex + 1,
        duration: 800 + targetIndex * 200,
        useNativeDriver: false,
      }).start();
    }
  }, [normalizedGrade, targetIndex]);

  if (!normalizedGrade || targetIndex < 0) {
    return (
      <View style={[styles.unknownBadge, { height: dims.bar, paddingHorizontal: dims.bar / 2 }]}>
        <Text style={[styles.unknownText, { fontSize: dims.font * 0.7 }]}>?</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { gap: dims.gap }]}>
      {GRADES.map((g, index) => {
        const color = NUTRISCORE_COLORS[g];
        const isTarget = g === normalizedGrade;

        // Opacité animée : 0.2 → 1 quand la barre atteint cette case
        const opacity = fillAnim.interpolate({
          inputRange: [index, index + 0.5, index + 1],
          outputRange: [0.2, 0.6, 1],
          extrapolate: 'clamp',
        });

        // Scale animée : bounce quand on atteint la case cible
        const scale = isTarget
          ? fillAnim.interpolate({
              inputRange: [index, index + 0.8, index + 1],
              outputRange: [0.8, 1.25, 1.15],
              extrapolate: 'clamp',
            })
          : fillAnim.interpolate({
              inputRange: [index, index + 1],
              outputRange: [0.85, 1],
              extrapolate: 'clamp',
            });

        return (
          <Animated.View
            key={g}
            style={[
              styles.gradeBox,
              {
                backgroundColor: color,
                height: dims.bar,
                width: dims.bar,
                borderRadius: dims.bar / 6,
                opacity,
                transform: [{ scale }],
              },
              isTarget && {
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
                  color: '#FFFFFF',
                  fontWeight: isTarget ? '800' : '600',
                },
              ]}
            >
              {g.toUpperCase()}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default AnimatedNutriScore;
