import { describe, it, expect } from 'vitest';
import { getSyllables } from '../src/index.js';

describe('getSyllables — syllable splitting', () => {
  const cases: [string, string[]][] = [
    ['leer', ['le', 'er']],
    ['casa', ['ca', 'sa']],
    ['perro', ['pe', 'rro']],
    ['calle', ['ca', 'lle']],
    ['guerra', ['gue', 'rra']],
    ['queso', ['que', 'so']],
    ['alcohol', ['al', 'co', 'hol']],
    ['ahora', ['a', 'ho', 'ra']],
    ['iglesia', ['i', 'gle', 'sia']],
    ['construir', ['cons', 'truir']],
    ['abstraer', ['abs', 'tra', 'er']],
    ['ejemplo', ['e', 'jem', 'plo']],
    ['examen', ['e', 'xa', 'men']],
    ['buey', ['buey']],
    ['sol', ['sol']],
    ['aire', ['ai', 're']],
    ['ciudad', ['ciu', 'dad']],
    ['murciélago', ['mur', 'cié', 'la', 'go']],
    ['día', ['dí', 'a']],
    ['ríe', ['rí', 'e']],
    ['oído', ['o', 'í', 'do']],
    ['pingüino', ['pin', 'güi', 'no']],
  ];

  for (const [word, expected] of cases) {
    it(`splits "${word}" → [${expected.join(', ')}]`, () => {
      const result = getSyllables(word);
      const syllables = result.syllables.map(s => s.syllable);
      expect(syllables).toEqual(expected);
    });
  }
});

describe('getSyllables — syllable count', () => {
  it('counts monosyllables', () => {
    expect(getSyllables('sol').syllableCount).toBe(1);
    expect(getSyllables('buey').syllableCount).toBe(1);
  });

  it('counts polysyllables', () => {
    expect(getSyllables('murciélago').syllableCount).toBe(4);
    expect(getSyllables('ejemplo').syllableCount).toBe(3);
  });
});

describe('getSyllables — tonic syllable', () => {
  it('detects tonic syllable with explicit accent', () => {
    const result = getSyllables('murciélago');
    expect(result.tonicSyllable).toBe(2); // "cié"
  });

  it('applies default oxytone rule', () => {
    const result = getSyllables('reloj');
    expect(result.tonicSyllable).toBe(2); // last syllable
  });

  it('applies default paroxytone rule', () => {
    const result = getSyllables('casa');
    expect(result.tonicSyllable).toBe(1); // second-to-last
  });
});

describe('getSyllables — accentuation type', () => {
  it('classifies oxytone words', () => {
    expect(getSyllables('reloj').accentuation).toBe('oxytone');
    expect(getSyllables('café').accentuation).toBe('oxytone');
  });

  it('classifies paroxytone words', () => {
    expect(getSyllables('casa').accentuation).toBe('paroxytone');
    expect(getSyllables('lápiz').accentuation).toBe('paroxytone');
  });

  it('classifies proparoxytone words', () => {
    expect(getSyllables('murciélago').accentuation).toBe('proparoxytone');
    expect(getSyllables('teléfono').accentuation).toBe('proparoxytone');
  });
});

describe('getSyllables — word normalization', () => {
  it('lowercases and trims input', () => {
    const result = getSyllables('  Casa  ');
    expect(result.word).toBe('casa');
  });
});

describe('getSyllables — output shape', () => {
  it('returns all expected properties', () => {
    const result = getSyllables('leer');
    expect(result).toHaveProperty('word');
    expect(result).toHaveProperty('wordLength');
    expect(result).toHaveProperty('syllableCount');
    expect(result).toHaveProperty('syllables');
    expect(result).toHaveProperty('tonicSyllable');
    expect(result).toHaveProperty('accentedLetterIndex');
    expect(result).toHaveProperty('accentuation');
    expect(result).toHaveProperty('hiatus');
    expect(result).toHaveProperty('diphthongs');
    expect(result).toHaveProperty('triphthongs');
  });
});
