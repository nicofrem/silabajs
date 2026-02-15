import type { ParsingState, SyllableInfo } from '../types.js';
import { isConsonant } from '../utils/vowels.js';
import { processOnset } from './onset.js';
import { processNucleus } from './nucleus.js';
import { processCoda } from './coda.js';

export interface SyllabifyResult {
  syllables: SyllableInfo[];
  syllableCount: number;
  tonicSyllable: number;
  accentedLetterIndex: number;
}

/**
 * Splits a word into syllables and determines the tonic syllable.
 * Pure function — no shared mutable state.
 */
export const syllabify = (word: string): SyllabifyResult => {
  const len = word.length;
  const syllables: SyllableInfo[] = [];
  let syllableCount = 0;

  let state: ParsingState = {
    position: 0,
    foundTonic: false,
    accentedLetterIndex: -1,
  };

  while (state.position < len) {
    syllableCount++;
    const startIndex = state.position;

    // Each syllable = onset + nucleus + coda
    state = processOnset(word, state);
    state = processNucleus(word, state);
    state = processCoda(word, state);

    syllables.push({
      syllable: word.substring(startIndex, state.position),
      startIndex,
    });
  }

  const tonicSyllable = determineTonic(word, syllables, syllableCount, state);

  return {
    syllables,
    syllableCount,
    tonicSyllable,
    accentedLetterIndex: state.accentedLetterIndex,
  };
};

/**
 * Determines the tonic (stressed) syllable position (1-indexed).
 * If no accent mark was found, applies default Spanish stress rules.
 */
const determineTonic = (
  word: string,
  _syllables: SyllableInfo[],
  syllableCount: number,
  state: ParsingState,
): number => {
  if (state.foundTonic) {
    // Find which syllable contains the accented letter
    return findTonicFromParsing(word, syllableCount, state);
  }

  // Default rules for words without explicit accent marks
  if (syllableCount < 2) return syllableCount; // monosyllables

  const lastChar = word[word.length - 1];
  const secondToLast = word[word.length - 2];

  // Words ending in vowel, 'n', or 's' (after a vowel) → paroxytone (stress on second-to-last)
  if ((!isConsonant(lastChar) || lastChar === 'y') ||
      ((lastChar === 'n' || (lastChar === 's' && !isConsonant(secondToLast))))) {
    return syllableCount - 1;
  }

  // Otherwise → oxytone (stress on last syllable)
  return syllableCount;
};

/**
 * When a tonic accent was found during parsing, we need to figure out
 * which syllable number it fell on. We track this by replay:
 * re-walk the syllables and find where the accent mark appears.
 */
const findTonicFromParsing = (
  word: string,
  syllableCount: number,
  state: ParsingState,
): number => {
  // Re-run syllable splitting just to find tonic position
  // (we already have the data from the main pass, but we need the
  // syllable boundaries to map accent position → syllable number)
  const len = word.length;
  let parseState: ParsingState = {
    position: 0,
    foundTonic: false,
    accentedLetterIndex: -1,
  };
  let tonicSyllable = 0;
  let count = 0;

  while (parseState.position < len) {
    count++;
    parseState = processOnset(word, parseState);
    parseState = processNucleus(word, parseState);
    parseState = processCoda(word, parseState);

    if (parseState.foundTonic && tonicSyllable === 0) {
      tonicSyllable = count;
    }
  }

  return tonicSyllable || syllableCount;
};
