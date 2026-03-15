/**
 * Écran Dashboard (Score personnel)
 * Affiche le score nutritionnel moyen, graphique d'évolution et statistiques
 */

import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import { nutriScoreToNumber, numberToNutriScore } from '../utils/api';
import { NUTRISCORE_COLORS } from '../constants/colors';
import NutriScoreBadge from '../components/NutriScoreBadge';
import EmptyState from '../components/EmptyState';

const DashboardScreen: React.FC = () => {
  const { colors } = useTheme();
  const { history } = useData();
  const { t } = useTranslation();

  // Calculs statistiques
  const stats = useMemo(() => {
    if (history.length === 0) return null;

    const scores = history
      .map((h) => nutriScoreToNumber(h.product.nutriscore_grade))
      .filter((s) => s > 0);

    if (scores.length === 0) return null;

    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const best = Math.max(...scores);
    const worst = Math.min(...scores);

    // Données par semaine (dernières 8 semaines)
    const weeklyData: { week: string; score: number; count: number }[] = [];
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7 + weekStart.getDay()));
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekScores = history
        .filter((h) => {
          const d = new Date(h.scannedAt);
          return d >= weekStart && d <= weekEnd;
        })
        .map((h) => nutriScoreToNumber(h.product.nutriscore_grade))
        .filter((s) => s > 0);

      const avg = weekScores.length > 0
        ? weekScores.reduce((a, b) => a + b, 0) / weekScores.length
        : 0;

      weeklyData.push({
        week: `S${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
        score: avg,
        count: weekScores.length,
      });
    }

    return {
      average,
      averageGrade: numberToNutriScore(average),
      best,
      bestGrade: numberToNutriScore(best),
      worst,
      worstGrade: numberToNutriScore(worst),
      totalScans: history.length,
      weeklyData,
    };
  }, [history]);

  if (!stats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="📊"
          title={t('noDashboardData')}
          message={t('noDashboardDataMsg')}
        />
      </View>
    );
  }

  const maxBarHeight = 120;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Score moyen global */}
      <View style={[styles.mainScoreCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.mainScoreLabel, { color: colors.textSecondary }]}>
          {t('averageScore')}
        </Text>
        <View style={styles.mainScoreRow}>
          <NutriScoreBadge grade={stats.averageGrade} size="large" />
          <Text style={[styles.mainScoreValue, { color: NUTRISCORE_COLORS[stats.averageGrade] }]}>
            {stats.average.toFixed(1)}/5
          </Text>
        </View>
      </View>

      {/* Statistiques rapides */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.statIcon}>📱</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalScans}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('totalScans')}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.statIcon}>🏆</Text>
          <Text style={[styles.statValue, { color: NUTRISCORE_COLORS[stats.bestGrade] }]}>
            {stats.bestGrade.toUpperCase()}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('bestScore')}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.statIcon}>📉</Text>
          <Text style={[styles.statValue, { color: NUTRISCORE_COLORS[stats.worstGrade] }]}>
            {stats.worstGrade.toUpperCase()}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('worstScore')}</Text>
        </View>
      </View>

      {/* Graphique d'évolution hebdomadaire */}
      <View style={[styles.chartSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>{t('weeklyEvolution')}</Text>
        <View style={styles.chart}>
          {stats.weeklyData.map((week, index) => {
            const barHeight = week.score > 0 ? (week.score / 5) * maxBarHeight : 4;
            const barColor = week.score > 0
              ? NUTRISCORE_COLORS[numberToNutriScore(week.score)]
              : colors.border;

            return (
              <View key={index} style={styles.chartColumn}>
                <View style={styles.barContainer}>
                  {week.count > 0 && (
                    <Text style={[styles.barValue, { color: colors.textSecondary }]}>
                      {week.score.toFixed(1)}
                    </Text>
                  )}
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: barColor,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.chartLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                  {week.week}
                </Text>
              </View>
            );
          })}
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
    padding: 16,
  },
  mainScoreCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  mainScoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  mainScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mainScoreValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  chartSection: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  chartTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
});

export default DashboardScreen;
