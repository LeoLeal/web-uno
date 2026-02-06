'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';

interface GameSettingsPanelProps {
  isHost: boolean;
}

export const GameSettingsPanel = ({ isHost }: GameSettingsPanelProps) => {
  const [showToast, setShowToast] = useState(false);

  const handleConfigure = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="panel-felt p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Settings className="w-5 h-5 text-(--copper-light)" />
        <div>
          <h3 className="font-semibold text-(--cream)">Game Settings</h3>
          <p className="text-sm text-(--cream-dark) opacity-70">
            Standard rules · 7 cards · No stacking
          </p>
        </div>
      </div>

      {isHost && (
        <button
          onClick={handleConfigure}
          className="btn-copper text-sm py-2 px-4"
        >
          Configure
        </button>
      )}

      {/* Coming Soon Toast */}
      {showToast && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 panel-felt px-4 py-2 text-sm text-(--cream) animate-pulse">
          Coming soon!
        </div>
      )}
    </div>
  );
};
