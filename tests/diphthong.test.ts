import { describe, it, expect } from 'vitest';
import { getSyllables } from '../src/index.js';

describe('diphthong detection', () => {
  it('detects rising diphthong (weak + strong)', () => {
    const result = getSyllables('iglesia');
    expect(result.diphthongs.some(d => d.type === 'rising')).toBe(true);
  });

  it('detects falling diphthong (strong + weak)', () => {
    const result = getSyllables('aire');
    expect(result.diphthongs).toContainEqual({
      type: 'falling',
      combination: 'ai',
    });
  });

  it('detects homogeneous diphthong (weak + weak)', () => {
    const result = getSyllables('ciudad');
    expect(result.diphthongs).toContainEqual({
      type: 'homogeneous',
      combination: 'iu',
    });
  });

  it('detects rising diphthong with accented strong vowel (ié)', () => {
    const result = getSyllables('murciélago');
    expect(result.diphthongs).toContainEqual({
      type: 'rising',
      combination: 'ié',
    });
    expect(result.syllables.map(s => s.syllable)).toEqual(['mur', 'cié', 'la', 'go']);
  });

  it('detects homogeneous diphthong with final y (uy in "muy")', () => {
    const result = getSyllables('muy');
    expect(result.diphthongs).toContainEqual({
      type: 'homogeneous',
      combination: 'uy',
    });
    expect(result.syllables.map(s => s.syllable)).toEqual(['muy']);
  });

  it('returns empty when no diphthong', () => {
    const result = getSyllables('sol');
    expect(result.diphthongs).toEqual([]);
  });
});

describe('triphthong detection', () => {
  it('detects triphthong (weak + strong + weak)', () => {
    const result = getSyllables('buey');
    expect(result.triphthongs.length).toBeGreaterThanOrEqual(1);
  });

  it('returns empty when no triphthong', () => {
    const result = getSyllables('casa');
    expect(result.triphthongs).toEqual([]);
  });
});
