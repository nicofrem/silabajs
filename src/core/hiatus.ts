import type { HiatusInfo } from '../types.js';
import { HIATUS_BREAKING_VOWELS } from '../constants.js';
import { isStrongVowel } from '../utils/vowels.js';

/**
 * Detects all hiatus occurrences in a word.
 * A hiatus is two vowels in contact that belong to different syllables:
 *   - Simple hiatus: two strong vowels (e.g. "ae", "eo")
 *   - Accentual hiatus: accented weak vowel + strong vowel (e.g. "ía", "úe")
 *
 * Also handles the special case where 'qu' should not produce a hiatus.
 */
export const detectHiatus = (
  word: string,
  accentedLetterIndex: number,
): HiatusInfo[] => {
  const result: HiatusInfo[] = [];
  let prevIsStrong = false;

  // Special case: the 'u' in "qu" followed by a tilde does not form hiatus
  if (
    accentedLetterIndex > 1 &&
    word[accentedLetterIndex - 1] === 'u' &&
    word[accentedLetterIndex - 2] === 'q'
  ) {
    result.push({
      type: 'simple',
      combination: `${word[accentedLetterIndex]}-${word[accentedLetterIndex + 1]}`,
    });
  }

  for (let i = 0; i < word.length; i++) {
    const c = word[i];

    // Accentual hiatus: accented weak vowel adjacent to a strong vowel
    if (HIATUS_BREAKING_VOWELS.has(c)) {
      if (i > 0 && isStrongVowel(word[i - 1])) {
        result.push({
          type: 'accentual',
          combination: `${word[i - 1]}-${c}`,
        });
        prevIsStrong = false;
        continue;
      }

      if (i < word.length - 1 && isStrongVowel(word[i + 1])) {
        result.push({
          type: 'accentual',
          combination: `${c}-${word[i + 1]}`,
        });
        prevIsStrong = false;
        continue;
      }
    }

    // Simple hiatus: two consecutive strong vowels
    if (prevIsStrong && isStrongVowel(c)) {
      result.push({
        type: 'simple',
        combination: `${word[i - 1]}-${c}`,
      });
    }

    // Simple hiatus with intercalated 'h'
    if (prevIsStrong && c === 'h' && i < word.length - 1 && isStrongVowel(word[i + 1])) {
      result.push({
        type: 'simple',
        combination: `${word[i - 1]}-h${word[i + 1]}`,
      });
    }

    prevIsStrong = isStrongVowel(c);
  }

  return result;
};
