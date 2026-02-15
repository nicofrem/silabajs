import type { AccentuationType } from '../types.js';

/**
 * Determines the accentuation type of a word given its syllable count
 * and tonic syllable position (1-indexed).
 */
export const getAccentuationType = (
  syllableCount: number,
  tonicSyllable: number,
): AccentuationType => {
  const distanceFromEnd = syllableCount - tonicSyllable;

  switch (distanceFromEnd) {
    case 0: return 'oxytone';
    case 1: return 'paroxytone';
    case 2: return 'proparoxytone';
    default: return 'superproparoxytone';
  }
};
