// --- Vowel classification sets (case-insensitive: we always work on lowercased words) ---

/** Strong (open) vowels — includes accented variants */
export const STRONG_VOWELS = new Set([
  'a', 'e', 'o',
  'á', 'é', 'ó',
  'à', 'è', 'ò',
]);

/** Weak (closed) vowels — unaccented only */
export const WEAK_VOWELS = new Set(['i', 'u', 'ü']);

/** Accented strong vowels */
export const ACCENTED_STRONG_VOWELS = new Set(['á', 'é', 'ó', 'à', 'è', 'ò']);

/** Accented weak vowels — these break diphthongs */
export const ACCENTED_WEAK_VOWELS = new Set(['í', 'ú', 'ì', 'ù', 'ü']);

/** All accented vowels */
export const ACCENTED_VOWELS = new Set([
  ...ACCENTED_STRONG_VOWELS,
  ...ACCENTED_WEAK_VOWELS,
]);

/** Every character considered a vowel (strong or weak, accented or not) */
export const ALL_VOWELS = new Set([
  ...STRONG_VOWELS,
  ...WEAK_VOWELS,
  ...ACCENTED_WEAK_VOWELS,
]);

/** Weak accented vowels that trigger accentual hiatus */
export const HIATUS_BREAKING_VOWELS = new Set(['í', 'ì', 'ú', 'ù']);

// --- Consonant cluster sets (for coda analysis) ---

/** Consonants that can precede 'l' to form an onset cluster */
export const L_CLUSTER_INITIALS = new Set(['b', 'v', 'c', 'k', 'f', 'g', 'p', 't']);

/** Consonants that can precede 'r' to form an onset cluster */
export const R_CLUSTER_INITIALS = new Set(['b', 'v', 'c', 'd', 'k', 'f', 'g', 'p', 't']);

/** Alveolar consonants that force a syllable break before 'y' */
export const Y_PRECEDING_ALVEOLARS = new Set(['s', 'l', 'r', 'n', 'c']);

/** Two-consonant groups that can start a syllable (foreign/learned words) */
export const ONSET_DIGRAPHS = new Set([
  'pt', 'ct', 'cn', 'ps', 'mn', 'gn', 'ft', 'pn', 'cz', 'tz', 'ts',
]);

// --- Spanish labels ---

import type { AccentuationType, DiphthongType, HiatusType } from './types.js';

export const ACCENT_LABELS: Record<AccentuationType, string> = {
  oxytone: 'Aguda',
  paroxytone: 'Grave',
  proparoxytone: 'Esdrújula',
  superproparoxytone: 'Sobresdrújula',
};

export const DIPHTHONG_LABELS: Record<DiphthongType, string> = {
  rising: 'Creciente',
  falling: 'Decreciente',
  homogeneous: 'Homogéneo',
};

export const HIATUS_LABELS: Record<HiatusType, string> = {
  simple: 'Simple',
  accentual: 'Acentual',
};

// --- Regex patterns for diphthong / triphthong detection ---

// Note: 'y' is included as weak-vowel equivalent in final position
export const TRIPHTHONG_RE = /([iu][aeoáéóàèò][iuy])/g;
export const RISING_DIPHTHONG_RE = /([iu][aeoáéóàèò])/g;
export const FALLING_DIPHTHONG_RE = /([aeoáéóàèò][iuy])/g;
export const HOMOGENEOUS_DIPHTHONG_RE = /([iu][iuy])/g;
