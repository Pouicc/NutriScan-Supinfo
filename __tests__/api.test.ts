/**
 * Tests unitaires pour les fonctions utilitaires
 * Couvre : formatNutrient, nutriScoreToNumber, numberToNutriScore
 */

import { formatNutrient, nutriScoreToNumber, numberToNutriScore } from '../src/utils/api';

// ==================== formatNutrient ====================

describe('formatNutrient', () => {
  const EM_DASH = '\u2014';

  it('retourne un tiret pour une valeur undefined', () => {
    expect(formatNutrient(undefined)).toBe(EM_DASH);
  });

  it('retourne un tiret pour une valeur null', () => {
    expect(formatNutrient(null as any)).toBe(EM_DASH);
  });

  it('formate une valeur en grammes par défaut', () => {
    expect(formatNutrient(3.5)).toBe('3.5 g');
  });

  it('formate une valeur avec 1 décimale', () => {
    expect(formatNutrient(10.123)).toBe('10.1 g');
  });

  it('formate en kcal sans décimale', () => {
    expect(formatNutrient(245.7, 'kcal')).toBe('246 kcal');
  });

  it('formate 0 correctement', () => {
    expect(formatNutrient(0)).toBe('0.0 g');
  });

  it('formate 0 kcal correctement', () => {
    expect(formatNutrient(0, 'kcal')).toBe('0 kcal');
  });
});

// ==================== nutriScoreToNumber ====================

describe('nutriScoreToNumber', () => {
  it('convertit A en 5', () => {
    expect(nutriScoreToNumber('a')).toBe(5);
  });

  it('convertit B en 4', () => {
    expect(nutriScoreToNumber('b')).toBe(4);
  });

  it('convertit C en 3', () => {
    expect(nutriScoreToNumber('c')).toBe(3);
  });

  it('convertit D en 2', () => {
    expect(nutriScoreToNumber('d')).toBe(2);
  });

  it('convertit E en 1', () => {
    expect(nutriScoreToNumber('e')).toBe(1);
  });

  it('gère les majuscules', () => {
    expect(nutriScoreToNumber('A')).toBe(5);
    expect(nutriScoreToNumber('C')).toBe(3);
  });

  it('retourne 0 pour undefined', () => {
    expect(nutriScoreToNumber(undefined)).toBe(0);
  });

  it('retourne 0 pour une lettre invalide', () => {
    expect(nutriScoreToNumber('z')).toBe(0);
  });
});

// ==================== numberToNutriScore ====================

describe('numberToNutriScore', () => {
  it('convertit 5 en a', () => {
    expect(numberToNutriScore(5)).toBe('a');
  });

  it('convertit 4.5 en a', () => {
    expect(numberToNutriScore(4.5)).toBe('a');
  });

  it('convertit 4 en b', () => {
    expect(numberToNutriScore(4)).toBe('b');
  });

  it('convertit 3.5 en b', () => {
    expect(numberToNutriScore(3.5)).toBe('b');
  });

  it('convertit 3 en c', () => {
    expect(numberToNutriScore(3)).toBe('c');
  });

  it('convertit 2 en d', () => {
    expect(numberToNutriScore(2)).toBe('d');
  });

  it('convertit 1 en e', () => {
    expect(numberToNutriScore(1)).toBe('e');
  });

  it('convertit 0 en e', () => {
    expect(numberToNutriScore(0)).toBe('e');
  });
});
