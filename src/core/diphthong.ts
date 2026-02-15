import type { SyllableInfo, DiphthongInfo, TriphthongInfo } from '../types.js';
import {
  TRIPHTHONG_RE,
  RISING_DIPHTHONG_RE,
  FALLING_DIPHTHONG_RE,
  HOMOGENEOUS_DIPHTHONG_RE,
} from '../constants.js';

/**
 * Detects diphthongs and triphthongs within the already-split syllables.
 * Each syllable is tested independently since diphthongs/triphthongs only
 * occur within a single syllable.
 */
export const detectDiphthongsAndTriphthongs = (
  syllables: SyllableInfo[],
): { diphthongs: DiphthongInfo[]; triphthongs: TriphthongInfo[] } => {
  const diphthongs: DiphthongInfo[] = [];
  const triphthongs: TriphthongInfo[] = [];

  for (const { syllable } of syllables) {
    // Triphthong: weak + strong + weak (e.g. "uai", "iei")
    const triphthongMatch = syllable.match(TRIPHTHONG_RE);
    if (triphthongMatch) {
      triphthongs.push({ combination: triphthongMatch[0] });
      continue; // a syllable with a triphthong won't also have a separate diphthong
    }

    // Rising diphthong: weak + strong (e.g. "ia", "ue")
    const risingMatch = syllable.match(RISING_DIPHTHONG_RE);
    if (risingMatch) {
      diphthongs.push({ type: 'rising', combination: risingMatch[0] });
      continue;
    }

    // Falling diphthong: strong + weak (e.g. "ai", "eu")
    const fallingMatch = syllable.match(FALLING_DIPHTHONG_RE);
    if (fallingMatch) {
      diphthongs.push({ type: 'falling', combination: fallingMatch[0] });
      continue;
    }

    // Homogeneous diphthong: weak + weak (e.g. "ui", "iu")
    const homogeneousMatch = syllable.match(HOMOGENEOUS_DIPHTHONG_RE);
    if (homogeneousMatch) {
      diphthongs.push({ type: 'homogeneous', combination: homogeneousMatch[0] });
    }
  }

  return { diphthongs, triphthongs };
};
