'use client';

import { useState, useMemo } from 'react';
import { Settings } from 'lucide-react';
import { useGameSettings } from '@/hooks/useGameSettings';
import { useGameState } from '@/hooks/useGameState';
import { GameSettingsModal } from './GameSettingsModal';
import { GameSettings, getSettingsSummary } from '@/lib/game/settings';

interface GameSettingsPanelProps {
  /** Whether the current user is the host */
  isHost: boolean;
}

export const GameSettingsPanel = ({ isHost }: GameSettingsPanelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { settings, updateSettings } = useGameSettings();
  const { status } = useGameState();

  const summary = useMemo(() => getSettingsSummary(settings), [settings]);

  const handleConfigure = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveSettings = (newSettings: GameSettings) => {
    updateSettings(newSettings);
  };

  // Only show configure button in LOBBY state
  const canConfigure = isHost && status === 'LOBBY';

  return (
    <>
      <div className="panel-felt p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-(--copper-light)" />
          <div>
            <h3 className="font-semibold text-(--cream)">Game Settings</h3>
            <p className="text-sm text-(--cream-dark) opacity-70">{summary}</p>
          </div>
        </div>

        {canConfigure && (
          <button
            onClick={handleConfigure}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-(--copper-light) border border-(--copper-border) rounded-lg hover:bg-(--copper-light)/10 hover:border-(--copper-light) hover:text-(--cream) transition-all"
          >
            Configure
          </button>
        )}
      </div>

      {canConfigure && (
        <GameSettingsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          currentSettings={settings}
          onSave={handleSaveSettings}
        />
      )}
    </>
  );
};
