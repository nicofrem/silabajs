/** Accentuation classification of a Spanish word */
export type AccentuationType =
  | 'oxytone'            // Aguda: stress on last syllable
  | 'paroxytone'         // Grave/Llana: stress on second-to-last
  | 'proparoxytone'      // Esdrújula: stress on third-to-last
  | 'superproparoxytone'; // Sobresdrújula: stress before third-to-last

/** A single syllable with its position in the original word */
export interface SyllableInfo {
  syllable: string;
  startIndex: number;
}

/** Hiatus type classification */
export type HiatusType = 'simple' | 'accentual';

/** A detected hiatus */
export interface HiatusInfo {
  type: HiatusType;
  combination: string;
}

/** Diphthong type classification */
export type DiphthongType = 'rising' | 'falling' | 'homogeneous';

/** A detected diphthong */
export interface DiphthongInfo {
  type: DiphthongType;
  combination: string;
}

/** A detected triphthong */
export interface TriphthongInfo {
  combination: string;
}

/** Full syllable analysis result for a Spanish word */
export interface SyllableResult {
  word: string;
  wordLength: number;
  syllableCount: number;
  syllables: SyllableInfo[];
  tonicSyllable: number;
  accentedLetterIndex: number;
  accentuation: AccentuationType;
  hiatus: HiatusInfo[];
  diphthongs: DiphthongInfo[];
  triphthongs: TriphthongInfo[];
}

/**
 * Internal mutable state threaded through onset/nucleus/coda parsing.
 * Not exported from the library — used only inside core/.
 */
export interface ParsingState {
  position: number;
  foundTonic: boolean;
  accentedLetterIndex: number;
}
