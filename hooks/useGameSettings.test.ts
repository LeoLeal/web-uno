import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Y from 'yjs';
import { useGameSettings } from './useGameSettings';
import { DEFAULT_SETTINGS, GameSettings } from '@/lib/game/settings';

// Mock the GameProvider
const mockDoc = new Y.Doc();

vi.mock('@/components/providers/GameProvider', () => ({
  useGame: () => ({ doc: mockDoc }),
}));

describe('useGameSettings', () => {
  beforeEach(() => {
    // Clear the Yjs document before each test
    const settingsMap = mockDoc.getMap('gameSettings');
    settingsMap.clear();
  });

  describe('reading settings', () => {
    it('should return default settings when map is empty', () => {
      const { result } = renderHook(() => useGameSettings());

      expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
    });

    it('should read settings from Yjs document', () => {
      const settingsMap = mockDoc.getMap('gameSettings');
      settingsMap.set('startingHandSize', 10);
      settingsMap.set('drawStacking', true);

      const { result } = renderHook(() => useGameSettings());

      expect(result.current.settings.startingHandSize).toBe(10);
      expect(result.current.settings.drawStacking).toBe(true);
      // Others should be default
      expect(result.current.settings.jumpIn).toBe(false);
    });

    it('should update when Yjs document changes', () => {
      const { result } = renderHook(() => useGameSettings());

      expect(result.current.settings.startingHandSize).toBe(7);

      act(() => {
        const settingsMap = mockDoc.getMap('gameSettings');
        settingsMap.set('startingHandSize', 5);
      });

      expect(result.current.settings.startingHandSize).toBe(5);
    });
  });

  describe('initSettings', () => {
    it('should initialize settings with defaults', () => {
      const { result } = renderHook(() => useGameSettings());

      act(() => {
        result.current.initSettings();
      });

      const settingsMap = mockDoc.getMap('gameSettings');
      expect(settingsMap.get('startingHandSize')).toBe(7);
      expect(settingsMap.get('scoreLimit')).toBe(null);
      expect(settingsMap.get('drawStacking')).toBe(false);
      expect(settingsMap.get('jumpIn')).toBe(false);
      expect(settingsMap.get('zeroSwap')).toBe(false);
      expect(settingsMap.get('sevenSwap')).toBe(false);
      expect(settingsMap.get('forcePlay')).toBe(false);
      expect(settingsMap.get('multipleCardPlay')).toBe(false);
    });

    it('should not overwrite existing settings', () => {
      const settingsMap = mockDoc.getMap('gameSettings');
      settingsMap.set('startingHandSize', 10);

      const { result } = renderHook(() => useGameSettings());

      act(() => {
        result.current.initSettings();
      });

      // Should keep the existing value
      expect(settingsMap.get('startingHandSize')).toBe(10);
    });
  });

  describe('updateSettings', () => {
    it('should update all settings in Yjs document', () => {
      const { result } = renderHook(() => useGameSettings());

      const newSettings: GameSettings = {
        startingHandSize: 10,
        scoreLimit: 500,
        drawStacking: true,
        jumpIn: true,
        zeroSwap: false,
        sevenSwap: true,
        forcePlay: false,
        multipleCardPlay: true,
      };

      act(() => {
        result.current.updateSettings(newSettings);
      });

      const settingsMap = mockDoc.getMap('gameSettings');
      expect(settingsMap.get('startingHandSize')).toBe(10);
      expect(settingsMap.get('scoreLimit')).toBe(500);
      expect(settingsMap.get('drawStacking')).toBe(true);
      expect(settingsMap.get('jumpIn')).toBe(true);
      expect(settingsMap.get('zeroSwap')).toBe(false);
      expect(settingsMap.get('sevenSwap')).toBe(true);
      expect(settingsMap.get('forcePlay')).toBe(false);
      expect(settingsMap.get('multipleCardPlay')).toBe(true);
    });

    it('should update local state after update', () => {
      const { result } = renderHook(() => useGameSettings());

      const newSettings: GameSettings = {
        ...DEFAULT_SETTINGS,
        startingHandSize: 5,
        drawStacking: true,
      };

      act(() => {
        result.current.updateSettings(newSettings);
      });

      expect(result.current.settings.startingHandSize).toBe(5);
      expect(result.current.settings.drawStacking).toBe(true);
    });
  });

  describe('scoreLimit null handling', () => {
    it('should handle null scoreLimit correctly', () => {
      const settingsMap = mockDoc.getMap('gameSettings');
      settingsMap.set('scoreLimit', null);

      const { result } = renderHook(() => useGameSettings());

      expect(result.current.settings.scoreLimit).toBe(null);
    });

    it('should set scoreLimit to null via updateSettings', () => {
      const { result } = renderHook(() => useGameSettings());

      act(() => {
        result.current.updateSettings({
          ...DEFAULT_SETTINGS,
          scoreLimit: null,
        });
      });

      const settingsMap = mockDoc.getMap('gameSettings');
      expect(settingsMap.get('scoreLimit')).toBe(null);
    });
  });
});
