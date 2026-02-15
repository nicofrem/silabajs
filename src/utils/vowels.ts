import {
  ALL_VOWELS,
  STRONG_VOWELS,
  WEAK_VOWELS,
  ACCENTED_VOWELS,
  ACCENTED_WEAK_VOWELS,
  ACCENTED_STRONG_VOWELS,
} from '../constants.js';

/** Returns true if `c` is a strong (open) vowel, including accented variants */
export const isStrongVowel = (c: string): boolean => STRONG_VOWELS.has(c);

/** Returns true if `c` is a weak (closed) unaccented vowel */
export const isWeakVowel = (c: string): boolean => WEAK_VOWELS.has(c);

/** Returns true if `c` is any kind of vowel */
export const isVowel = (c: string): boolean => ALL_VOWELS.has(c);

/** Returns true if `c` is not a vowel */
export const isConsonant = (c: string): boolean => !ALL_VOWELS.has(c);

/** Returns true if `c` is an accented vowel (strong or weak) */
export const isAccented = (c: string): boolean => ACCENTED_VOWELS.has(c);

/** Returns true if `c` is an accented weak vowel (breaks diphthongs) */
export const isAccentedWeak = (c: string): boolean => ACCENTED_WEAK_VOWELS.has(c);

/** Returns true if `c` is an accented strong vowel */
export const isAccentedStrong = (c: string): boolean => ACCENTED_STRONG_VOWELS.has(c);

/**
 * Classifies a vowel for nucleus parsing:
 *   0 = strong (or accented strong)
 *   1 = accented weak (breaks diphthongs)
 *   2 = weak unaccented
 *   -1 = not a vowel
 */
export const vowelStrength = (c: string): -1 | 0 | 1 | 2 => {
  if (isAccentedStrong(c) || isStrongVowel(c)) return 0;
  if (isAccentedWeak(c)) return 1;
  if (isWeakVowel(c)) return 2;
  return -1;
};
