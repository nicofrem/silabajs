import { describe, it, expect } from 'vitest';
import {
  isConsonant,
  isStrongVowel,
  isWeakVowel,
  isVowel,
  isAccented,
  isAccentedWeak,
  vowelStrength,
} from '../src/utils/vowels.js';

describe('isStrongVowel', () => {
  it('returns true for unaccented strong vowels', () => {
    for (const v of ['a', 'e', 'o']) {
      expect(isStrongVowel(v)).toBe(true);
    }
  });

  it('returns true for accented strong vowels', () => {
    for (const v of ['á', 'é', 'ó', 'à', 'è', 'ò']) {
      expect(isStrongVowel(v)).toBe(true);
    }
  });

  it('returns false for weak vowels and consonants', () => {
    expect(isStrongVowel('i')).toBe(false);
    expect(isStrongVowel('u')).toBe(false);
    expect(isStrongVowel('b')).toBe(false);
  });
});

describe('isWeakVowel', () => {
  it('returns true for i, u, ü', () => {
    expect(isWeakVowel('i')).toBe(true);
    expect(isWeakVowel('u')).toBe(true);
    expect(isWeakVowel('ü')).toBe(true);
  });

  it('returns false for accented weak vowels', () => {
    expect(isWeakVowel('í')).toBe(false);
    expect(isWeakVowel('ú')).toBe(false);
  });
});

describe('isConsonant', () => {
  it('returns true for consonants', () => {
    for (const c of ['b', 'c', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't']) {
      expect(isConsonant(c)).toBe(true);
    }
  });

  it('returns false for all vowel types', () => {
    for (const v of ['a', 'e', 'i', 'o', 'u', 'á', 'í', 'ü']) {
      expect(isConsonant(v)).toBe(false);
    }
  });
});

describe('isVowel', () => {
  it('returns true for all vowel variants', () => {
    for (const v of ['a', 'á', 'i', 'í', 'u', 'ú', 'ü', 'e', 'é', 'o', 'ó']) {
      expect(isVowel(v)).toBe(true);
    }
  });
});

describe('isAccented', () => {
  it('detects accented vowels', () => {
    for (const v of ['á', 'é', 'í', 'ó', 'ú', 'à', 'è', 'ì', 'ò', 'ù', 'ü']) {
      expect(isAccented(v)).toBe(true);
    }
  });

  it('rejects unaccented vowels', () => {
    for (const v of ['a', 'e', 'i', 'o', 'u']) {
      expect(isAccented(v)).toBe(false);
    }
  });
});

describe('isAccentedWeak', () => {
  it('detects accented weak vowels', () => {
    expect(isAccentedWeak('í')).toBe(true);
    expect(isAccentedWeak('ú')).toBe(true);
    expect(isAccentedWeak('ü')).toBe(true);
  });

  it('rejects accented strong vowels', () => {
    expect(isAccentedWeak('á')).toBe(false);
    expect(isAccentedWeak('é')).toBe(false);
  });
});

describe('vowelStrength', () => {
  it('returns 0 for strong vowels', () => {
    expect(vowelStrength('a')).toBe(0);
    expect(vowelStrength('é')).toBe(0);
  });

  it('returns 1 for accented weak vowels', () => {
    expect(vowelStrength('í')).toBe(1);
    expect(vowelStrength('ú')).toBe(1);
  });

  it('returns 2 for unaccented weak vowels', () => {
    expect(vowelStrength('i')).toBe(2);
    expect(vowelStrength('u')).toBe(2);
  });

  it('returns -1 for consonants', () => {
    expect(vowelStrength('b')).toBe(-1);
    expect(vowelStrength('s')).toBe(-1);
  });
});
