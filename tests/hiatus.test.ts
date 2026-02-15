import { describe, it, expect } from 'vitest';
import { getSyllables } from '../src/index.js';

describe('hiatus detection', () => {
  it('detects simple hiatus (two strong vowels)', () => {
    const result = getSyllables('leer');
    expect(result.hiatus).toContainEqual({
      type: 'simple',
      combination: 'e-e',
    });
  });

  it('detects accentual hiatus (accented weak + strong)', () => {
    const result = getSyllables('día');
    expect(result.hiatus).toContainEqual({
      type: 'accentual',
      combination: 'í-a',
    });
  });

  it('detects accentual hiatus with strong before accented weak', () => {
    const result = getSyllables('oído');
    expect(result.hiatus).toContainEqual({
      type: 'accentual',
      combination: 'o-í',
    });
  });

  it('returns empty array when no hiatus', () => {
    const result = getSyllables('casa');
    expect(result.hiatus).toEqual([]);
  });

  it('detects simple hiatus with intercalated h', () => {
    const result = getSyllables('ahora');
    // "a" and "o" are strong vowels separated by 'h'
    expect(result.hiatus.length).toBeGreaterThanOrEqual(1);
    expect(result.hiatus.some(h => h.type === 'simple')).toBe(true);
  });
});
