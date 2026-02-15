import type { ParsingState } from '../types.js';
import { isConsonant, vowelStrength } from '../utils/vowels.js';

/**
 * Processes the nucleus (núcleo) of a syllable.
 * The nucleus contains the vowel core and handles diphthongs/triphthongs
 * within a single syllable, as well as hiatus detection (two strong vowels
 * that belong to different syllables).
 *
 * Returns a new ParsingState with position advanced past the nucleus and
 * tonic/accent info updated.
 */
export const processNucleus = (word: string, state: ParsingState): ParsingState => {
  const len = word.length;
  let pos = state.position;
  let foundTonic = state.foundTonic;
  let accentedLetterIndex = state.accentedLetterIndex;

  if (pos >= len) return { position: pos, foundTonic, accentedLetterIndex };

  // Skip 'y' at the start of the nucleus — treat it as a consonant
  if (word[pos] === 'y') pos++;

  // --- First vowel ---
  let prevStrength = -1; // 0=strong, 1=accented-weak, 2=weak, -1=none

  if (pos < len) {
    const strength = vowelStrength(word[pos]);

    if (strength === 0) {
      // Strong vowel (possibly accented)
      if (isAccentedStrongChar(word[pos])) {
        accentedLetterIndex = pos;
        foundTonic = true;
      }
      prevStrength = 0;
      pos++;
    } else if (strength === 1) {
      // Accented weak vowel — breaks any diphthong, ends nucleus immediately
      accentedLetterIndex = pos;
      foundTonic = true;
      pos++;
      return { position: pos, foundTonic, accentedLetterIndex };
    } else if (strength === 2) {
      // Weak unaccented vowel
      prevStrength = 2;
      pos++;
    }
    // else: not a vowel — no nucleus (shouldn't happen normally)
  }

  // --- Intercalated 'h' — does not affect diphthong/hiatus ---
  let hasIntercalatedH = false;
  if (pos < len && word[pos] === 'h') {
    pos++;
    hasIntercalatedH = true;
  }

  // --- Second vowel ---
  if (pos < len) {
    const strength = vowelStrength(word[pos]);

    if (strength === 0) {
      // Strong vowel (possibly accented)
      if (isAccentedStrongChar(word[pos])) {
        accentedLetterIndex = pos;
        if (prevStrength !== 0) foundTonic = true;
      }
      if (prevStrength === 0) {
        // Two strong vowels → hiatus: they don't share a syllable
        if (hasIntercalatedH) pos--;
        return { position: pos, foundTonic, accentedLetterIndex };
      }
      // weak + strong → diphthong (rising), continue
      pos++;
    } else if (strength === 1) {
      // Accented weak vowel
      accentedLetterIndex = pos;
      if (prevStrength !== 0) {
        // weak + accented-weak or nothing + accented-weak → diphthong
        foundTonic = true;
        pos++;
      } else if (hasIntercalatedH) {
        // strong + h + accented-weak → hiatus
        pos--;
      }
      // strong + accented-weak → hiatus (pos not advanced)
      return { position: pos, foundTonic, accentedLetterIndex };
    } else if (strength === 2) {
      // Weak unaccented vowel
      if (pos < len - 1) {
        // Check if there's a third vowel ahead — could be triphthong
        const nextChar = word[pos + 1];
        if (!isConsonant(nextChar)) {
          // Third vowel exists: current weak vowel might start a new nucleus
          if (hasIntercalatedH && word[pos - 1] === 'h') {
            pos--;
          }
          return { position: pos, foundTonic, accentedLetterIndex };
        }
      }

      // Two identical weak vowels don't form diphthong
      if (word[pos] !== word[pos - 1]) {
        pos++;
      }
      return { position: pos, foundTonic, accentedLetterIndex };
    }
  }

  // --- Third vowel (triphthong check) ---
  if (pos < len) {
    const c = word[pos];
    if (c === 'i' || c === 'u') {
      pos++; // weak vowel → triphthong
    }
  }

  return { position: pos, foundTonic, accentedLetterIndex };
};

// --- helpers (private) ---

const ACCENTED_STRONG = new Set(['á', 'é', 'ó', 'à', 'è', 'ò']);
const isAccentedStrongChar = (c: string): boolean => ACCENTED_STRONG.has(c);
