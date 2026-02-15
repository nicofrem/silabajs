import type { ParsingState } from '../types.js';
import { isConsonant } from '../utils/vowels.js';

/**
 * Processes the onset (ataque) of a syllable starting at `state.position`.
 * Returns a new state with position advanced past the onset.
 *
 * The onset consists of all initial consonants, plus special handling for
 * "qu", "gu" (before e/i), and "gü".
 */
export const processOnset = (word: string, state: ParsingState): ParsingState => {
  const len = word.length;
  let pos = state.position;
  let lastConsonant = 'a'; // dummy default

  // Consume all leading consonants (except 'y', which acts as vowel here)
  while (pos < len && isConsonant(word[pos]) && word[pos] !== 'y') {
    lastConsonant = word[pos];
    pos++;
  }

  // Handle (q|g) + u combinations
  if (pos < len - 1) {
    if (word[pos] === 'u') {
      // "qu" — the u is silent
      if (lastConsonant === 'q') {
        pos++;
      } else if (lastConsonant === 'g') {
        // "gu" before e/é/i/í — the u is silent
        const next = word[pos + 1];
        if (next === 'e' || next === 'é' || next === 'i' || next === 'í') {
          pos++;
        }
      }
    } else if ((word[pos] === 'ü' || word[pos] === 'Ü') && lastConsonant === 'g') {
      // "gü" — diaeresis u is part of onset
      pos++;
    }
  }

  return { ...state, position: pos };
};
