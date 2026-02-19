import { describe, it, expect } from 'vitest';
import { generateRoomId, formatRoomId, normalizeRoomId } from './room-code';

describe('generateRoomId', () => {
  it('should return adjective-noun-number format', () => {
    const id = generateRoomId();
    const parts = id.split('-');
    expect(parts).toHaveLength(3);
  });

  it('should produce a 2-digit number between 10 and 99', () => {
    for (let i = 0; i < 50; i++) {
      const id = generateRoomId();
      const num = Number(id.split('-')[2]);
      expect(num).toBeGreaterThanOrEqual(10);
      expect(num).toBeLessThanOrEqual(99);
    }
  });

  it('should be all lowercase with hyphen separators', () => {
    for (let i = 0; i < 20; i++) {
      const id = generateRoomId();
      expect(id).toMatch(/^[a-z]+-[a-z]+-\d{2}$/);
    }
  });
});

describe('formatRoomId', () => {
  it('should capitalize words and bracket the number', () => {
    expect(formatRoomId('happy-lions-42')).toBe('Happy Lions [42]');
  });

  it('should return input unchanged for invalid format', () => {
    expect(formatRoomId('invalid')).toBe('invalid');
    expect(formatRoomId('too-many-parts-here')).toBe('too-many-parts-here');
  });
});

describe('normalizeRoomId', () => {
  it('should lowercase and hyphenate spaced input', () => {
    expect(normalizeRoomId('Happy Lions 42')).toBe('happy-lions-42');
  });

  it('should collapse multiple separators', () => {
    expect(normalizeRoomId('Happy__Lions--42')).toBe('happy-lions-42');
  });

  it('should strip leading and trailing non-alphanumeric chars', () => {
    expect(normalizeRoomId('--happy-lions-42--')).toBe('happy-lions-42');
  });

  it('should pass through already-normalized input', () => {
    expect(normalizeRoomId('happy-lions-42')).toBe('happy-lions-42');
  });
});
