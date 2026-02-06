import { useEffect, useState, useCallback } from 'react';
import { useGame } from '@/components/providers/GameProvider';
import {
  GameSettings,
  DEFAULT_SETTINGS,
  BooleanSettingKey,
  StartingHandSize,
  ScoreLimit,
} from '@/lib/game/settings';

/**
 * Hook for reading and updating game settings from the Yjs document.
 * 
 * Settings are stored in a Y.Map('gameSettings') and synced to all peers.
 * Only the host should call updateSettings; guests receive updates automatically.
 */
export const useGameSettings = () => {
  const { doc } = useGame();
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  // Subscribe to settings changes
  useEffect(() => {
    if (!doc) return;

    const settingsMap = doc.getMap('gameSettings');

    const handleChange = () => {
      // Read all settings from the map, falling back to defaults
      const currentSettings: GameSettings = {
        startingHandSize:
          (settingsMap.get('startingHandSize') as StartingHandSize) ??
          DEFAULT_SETTINGS.startingHandSize,
        scoreLimit:
          settingsMap.has('scoreLimit')
            ? (settingsMap.get('scoreLimit') as ScoreLimit)
            : DEFAULT_SETTINGS.scoreLimit,
        drawStacking:
          (settingsMap.get('drawStacking') as boolean) ?? DEFAULT_SETTINGS.drawStacking,
        jumpIn: (settingsMap.get('jumpIn') as boolean) ?? DEFAULT_SETTINGS.jumpIn,
        zeroSwap: (settingsMap.get('zeroSwap') as boolean) ?? DEFAULT_SETTINGS.zeroSwap,
        sevenSwap: (settingsMap.get('sevenSwap') as boolean) ?? DEFAULT_SETTINGS.sevenSwap,
        forcePlay: (settingsMap.get('forcePlay') as boolean) ?? DEFAULT_SETTINGS.forcePlay,
        multipleCardPlay:
          (settingsMap.get('multipleCardPlay') as boolean) ?? DEFAULT_SETTINGS.multipleCardPlay,
      };
      setSettings(currentSettings);
    };

    settingsMap.observe(handleChange);
    handleChange(); // Initial read

    return () => {
      settingsMap.unobserve(handleChange);
    };
  }, [doc]);

  /**
   * Initialize settings with defaults (host only).
   * Should be called once when the host creates the room.
   */
  const initSettings = useCallback(() => {
    if (!doc) return;

    const settingsMap = doc.getMap('gameSettings');

    // Only initialize if not already set
    if (!settingsMap.has('startingHandSize')) {
      doc.transact(() => {
        settingsMap.set('startingHandSize', DEFAULT_SETTINGS.startingHandSize);
        settingsMap.set('scoreLimit', DEFAULT_SETTINGS.scoreLimit);
        settingsMap.set('drawStacking', DEFAULT_SETTINGS.drawStacking);
        settingsMap.set('jumpIn', DEFAULT_SETTINGS.jumpIn);
        settingsMap.set('zeroSwap', DEFAULT_SETTINGS.zeroSwap);
        settingsMap.set('sevenSwap', DEFAULT_SETTINGS.sevenSwap);
        settingsMap.set('forcePlay', DEFAULT_SETTINGS.forcePlay);
        settingsMap.set('multipleCardPlay', DEFAULT_SETTINGS.multipleCardPlay);
      });
    }
  }, [doc]);

  /**
   * Update settings (host only).
   * All changes are applied in a single transaction.
   */
  const updateSettings = useCallback(
    (newSettings: GameSettings) => {
      if (!doc) return;

      const settingsMap = doc.getMap('gameSettings');

      doc.transact(() => {
        settingsMap.set('startingHandSize', newSettings.startingHandSize);
        settingsMap.set('scoreLimit', newSettings.scoreLimit);
        settingsMap.set('drawStacking', newSettings.drawStacking);
        settingsMap.set('jumpIn', newSettings.jumpIn);
        settingsMap.set('zeroSwap', newSettings.zeroSwap);
        settingsMap.set('sevenSwap', newSettings.sevenSwap);
        settingsMap.set('forcePlay', newSettings.forcePlay);
        settingsMap.set('multipleCardPlay', newSettings.multipleCardPlay);
      });
    },
    [doc]
  );

  return {
    settings,
    initSettings,
    updateSettings,
  };
};
