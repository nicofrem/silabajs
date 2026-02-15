import type { ParsingState } from '../types.js';
import { isConsonant } from '../utils/vowels.js';
import {
  L_CLUSTER_INITIALS,
  R_CLUSTER_INITIALS,
  Y_PRECEDING_ALVEOLARS,
  ONSET_DIGRAPHS,
} from '../constants.js';

/**
 * Processes the coda of a syllable.
 * The coda consists of consonants that close the current syllable.
 * Consonants that can form a valid onset for the next syllable are left for it.
 *
 * Returns a new ParsingState with position advanced past the coda.
 */
export const processCoda = (word: string, state: ParsingState): ParsingState => {
  const len = word.length;
  let pos = state.position;

  // No coda if we're at end or next char is a vowel
  if (pos >= len || !isConsonant(word[pos])) {
    return { ...state, position: pos };
  }

  // Single consonant at end of word → belongs to this syllable
  if (pos === len - 1) {
    return { ...state, position: pos + 1 };
  }

  // Single consonant between vowels → belongs to NEXT syllable
  if (!isConsonant(word[pos + 1])) {
    return { ...state, position: pos };
  }

  const c1 = word[pos];
  const c2 = word[pos + 1];

  // --- Two consonants, possibly followed by more ---
  if (pos < len - 2) {
    const c3 = word[pos + 2];

    if (!isConsonant(c3)) {
      // Only two consonants between vowels
      return handleTwoConsonants(word, state, pos, c1, c2);
    }

    // Three or more consonants
    return handleThreeOrMoreConsonants(word, state, pos, c1, c2, c3);
  }

  // Two consonants at end of word
  if (c2 === 'y') return { ...state, position: pos };
  return { ...state, position: pos + 2 };
};

// ---- Handlers for consonant cluster analysis ----

const handleTwoConsonants = (
  _word: string,
  state: ParsingState,
  pos: number,
  c1: string,
  c2: string,
): ParsingState => {
  // Digraphs that begin a syllable: ll, ch, rr
  if ((c1 === 'l' && c2 === 'l') ||
      (c1 === 'c' && c2 === 'h') ||
      (c1 === 'r' && c2 === 'r')) {
    return { ...state, position: pos }; // both go to next syllable
  }

  // 'h' after non-s/non-r consonant starts a new syllable (nh, lh, ph…)
  if (c1 !== 's' && c1 !== 'r' && c2 === 'h') {
    return { ...state, position: pos };
  }

  // 'y' after alveolar → break before the alveolar; else break before y
  if (c2 === 'y') {
    if (Y_PRECEDING_ALVEOLARS.has(c1)) return { ...state, position: pos };
    return { ...state, position: pos + 1 };
  }

  // Consonant + l cluster
  if (L_CLUSTER_INITIALS.has(c1) && c2 === 'l') {
    return { ...state, position: pos }; // cluster starts next syllable
  }

  // Consonant + r cluster
  if (R_CLUSTER_INITIALS.has(c1) && c2 === 'r') {
    return { ...state, position: pos }; // cluster starts next syllable
  }

  // Default: first consonant closes current syllable
  return { ...state, position: pos + 1 };
};

const handleThreeOrMoreConsonants = (
  word: string,
  state: ParsingState,
  pos: number,
  c1: string,
  c2: string,
  c3: string,
): ParsingState => {
  const len = word.length;

  // Three consonants at end of word
  if (pos + 3 === len) {
    if (c2 === 'y') {
      if (Y_PRECEDING_ALVEOLARS.has(c1)) return { ...state, position: pos };
    }
    if (c3 === 'y') {
      return { ...state, position: pos + 1 }; // y acts as vowel
    }
    // Foreign word ending in three consonants
    return { ...state, position: pos + 3 };
  }

  // 'y' as second consonant acts as vowel
  if (c2 === 'y') {
    if (Y_PRECEDING_ALVEOLARS.has(c1)) return { ...state, position: pos };
    return { ...state, position: pos + 1 };
  }

  // Learned/foreign onset digraphs (pt, ct, cn, ps, mn, gn, ft, pn, cz, tz, ts)
  if (ONSET_DIGRAPHS.has(c2 + c3)) {
    return { ...state, position: pos + 1 };
  }

  // c3 is 'l' or 'r' → c2+c3 form onset cluster; or 'ch'; or y-as-vowel
  if (c3 === 'l' || c3 === 'r' || (c2 === 'c' && c3 === 'h') || c3 === 'y') {
    return { ...state, position: pos + 1 }; // next syllable starts at c2
  }

  // Default: c1+c2 close current syllable, c3 starts next
  return { ...state, position: pos + 2 };
};
