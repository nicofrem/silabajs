export type {
  SyllableResult,
  SyllableInfo,
  AccentuationType,
  HiatusInfo,
  HiatusType,
  DiphthongInfo,
  DiphthongType,
  TriphthongInfo,
} from './types.js';

import type { SyllableResult } from './types.js';
import { syllabify } from './core/syllabify.js';
import { getAccentuationType } from './core/accentuation.js';
import { detectHiatus } from './core/hiatus.js';
import { detectDiphthongsAndTriphthongs } from './core/diphthong.js';

/**
 * Analyzes a Spanish word and returns its full syllable decomposition,
 * including accentuation type, hiatus, diphthongs and triphthongs.
 */
export const getSyllables = (input: string): SyllableResult => {
  const word = input.toLowerCase().trim();
  const { syllables, syllableCount, tonicSyllable, accentedLetterIndex } = syllabify(word);
  const accentuation = getAccentuationType(syllableCount, tonicSyllable);
  const hiatus = detectHiatus(word, accentedLetterIndex);
  const { diphthongs, triphthongs } = detectDiphthongsAndTriphthongs(syllables);

  return {
    word,
    wordLength: word.length,
    syllableCount,
    syllables,
    tonicSyllable,
    accentedLetterIndex,
    accentuation,
    hiatus,
    diphthongs,
    triphthongs,
  };
};
