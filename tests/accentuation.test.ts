import { describe, it, expect } from 'vitest';
import { getAccentuationType } from '../src/core/accentuation.js';

describe('getAccentuationType', () => {
  it('returns oxytone when tonic is the last syllable', () => {
    expect(getAccentuationType(3, 3)).toBe('oxytone');
    expect(getAccentuationType(1, 1)).toBe('oxytone');
  });

  it('returns paroxytone when tonic is second-to-last', () => {
    expect(getAccentuationType(3, 2)).toBe('paroxytone');
    expect(getAccentuationType(2, 1)).toBe('paroxytone');
  });

  it('returns proparoxytone when tonic is third-to-last', () => {
    expect(getAccentuationType(3, 1)).toBe('proparoxytone');
    expect(getAccentuationType(4, 2)).toBe('proparoxytone');
  });

  it('returns superproparoxytone when tonic is before third-to-last', () => {
    expect(getAccentuationType(4, 1)).toBe('superproparoxytone');
    expect(getAccentuationType(5, 1)).toBe('superproparoxytone');
  });
});
