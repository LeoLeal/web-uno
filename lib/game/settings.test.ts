import { describe, it, expect } from 'vitest';
import { getSettingsSummary, DEFAULT_SETTINGS, GameSettings } from './settings';

describe('getSettingsSummary', () => {
  it('should return correct summary for default settings', () => {
    const result = getSettingsSummary(DEFAULT_SETTINGS);
    expect(result).toBe('No stacking · 7 cards · Single Round');
  });

  it('should show Stacking when drawStacking is enabled', () => {
    const settings: GameSettings = { ...DEFAULT_SETTINGS, drawStacking: true };
    const result = getSettingsSummary(settings);
    expect(result).toContain('Stacking');
    expect(result).not.toContain('No stacking');
  });

  it('should include all enabled house rules', () => {
    const settings: GameSettings = {
      ...DEFAULT_SETTINGS,
      drawStacking: true,
      jumpIn: true,
      zeroSwap: true,
      sevenSwap: true,
      forcePlay: true,
      multipleCardPlay: true,
    };
    const result = getSettingsSummary(settings);
    expect(result).toContain('Stacking');
    expect(result).toContain('Jump-In');
    expect(result).toContain('0-Swap');
    expect(result).toContain('7-Swap');
    expect(result).toContain('Force Play');
    expect(result).toContain('Multi-Play');
  });

  it('should include score limit when set', () => {
    const settings: GameSettings = { ...DEFAULT_SETTINGS, scoreLimit: 500 };
    const result = getSettingsSummary(settings);
    expect(result).toContain('500 pts');
  });

  it('should include single round label when score limit is null', () => {
    const settings: GameSettings = { ...DEFAULT_SETTINGS, scoreLimit: null };
    const result = getSettingsSummary(settings);
    expect(result).toContain('Single Round');
    expect(result).not.toContain('∞');
  });

  it('should include infinity label when score limit is Infinity', () => {
    const settings: GameSettings = { ...DEFAULT_SETTINGS, scoreLimit: Infinity };
    const result = getSettingsSummary(settings);
    expect(result).toContain('∞');
  });

  it('should reflect different hand sizes', () => {
    const settings5: GameSettings = { ...DEFAULT_SETTINGS, startingHandSize: 5 };
    const settings10: GameSettings = { ...DEFAULT_SETTINGS, startingHandSize: 10 };

    expect(getSettingsSummary(settings5)).toContain('5 cards');
    expect(getSettingsSummary(settings10)).toContain('10 cards');
  });

  it('should use · separator between parts', () => {
    const settings: GameSettings = { ...DEFAULT_SETTINGS, jumpIn: true, scoreLimit: 200 };
    const result = getSettingsSummary(settings);
    const parts = result.split(' · ');
    expect(parts.length).toBeGreaterThanOrEqual(4);
    expect(parts[0]).toBe('No stacking');
    expect(parts[1]).toBe('Jump-In');
  });
});
