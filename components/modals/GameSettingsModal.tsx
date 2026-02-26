'use client';

import { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { PillButtonGroup } from '@/components/ui/PillButtonGroup';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import {
  GameSettings,
  DEFAULT_SETTINGS,
  SETTING_DESCRIPTIONS,
  BOOLEAN_SETTING_KEYS,
  BOOLEAN_SETTING_LABELS,
  IMPLEMENTED_RULES,
  STARTING_HAND_SIZES,
  SCORE_LIMITS,
  StartingHandSize,
  ScoreLimit,
  BooleanSettingKey,
} from '@/lib/game/settings';

interface GameSettingsModalProps {
  /** Called when the modal should close */
  onClose: () => void;
  /** Current settings from Yjs */
  currentSettings: GameSettings;
  /** Called when settings should be saved */
  onSave: (settings: GameSettings) => void;
}

const handSizeOptions = STARTING_HAND_SIZES.map((size) => ({
  value: size,
  label: String(size),
}));

const scoreLimitOptions = SCORE_LIMITS.map((limit) => ({
  value: limit,
  label: limit === null ? 'Single Round' : limit === Infinity ? '∞' : String(limit),
}));

/**
 * Modal for configuring game settings.
 * Host-only component that allows customizing game rules.
 */
export const GameSettingsModal = ({
  onClose,
  currentSettings,
  onSave,
}: GameSettingsModalProps) => {
  // Draft state for editing — initialized from current settings on each mount
  const [draft, setDraft] = useState<GameSettings>(currentSettings);

  const handleHandSizeChange = useCallback((value: StartingHandSize) => {
    setDraft((prev) => ({ ...prev, startingHandSize: value }));
  }, []);

  const handleScoreLimitChange = useCallback((value: ScoreLimit) => {
    setDraft((prev) => ({ ...prev, scoreLimit: value }));
  }, []);

  const handleToggleChange = useCallback((key: BooleanSettingKey, value: boolean) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(() => {
    onSave(draft);
    onClose();
  }, [draft, onSave, onClose]);

  const handleReset = useCallback(() => {
    setDraft(DEFAULT_SETTINGS);
  }, []);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      aria-labelledby="settings-modal-title"
      className="w-full max-w-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 id="settings-modal-title" className="text-xl font-bold text-(--cream)">
          Game Settings
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full text-(--cream-dark) hover:text-(--cream) hover:bg-(--felt-light) transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Deal Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-(--copper-light) uppercase tracking-wider mb-4">
          Deal
        </h3>

        {/* Starting Hand Size */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-(--cream)">Starting Hand Size</label>
            <InfoTooltip content={SETTING_DESCRIPTIONS.startingHandSize} />
          </div>
          <PillButtonGroup
            options={handSizeOptions}
            value={draft.startingHandSize}
            onChange={handleHandSizeChange}
            aria-label="Starting hand size"
          />
        </div>

        {/* Score Limit */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-(--cream)">Score Limit</label>
            <InfoTooltip content={SETTING_DESCRIPTIONS.scoreLimit} />
          </div>
          <PillButtonGroup
            options={scoreLimitOptions}
            value={draft.scoreLimit}
            onChange={handleScoreLimitChange}
            aria-label="Score limit"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="divider-copper mb-6" />

      {/* House Rules Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-(--copper-light) uppercase tracking-wider mb-4">
          House Rules
        </h3>

        <div className="space-y-4">
          {BOOLEAN_SETTING_KEYS.map((key) => {
            const isImplemented = IMPLEMENTED_RULES.has(key);
            return (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={`setting-${key}`}
                    className={`text-sm font-medium ${isImplemented ? 'text-(--cream)' : 'text-(--cream-dark) opacity-50'}`}
                  >
                    {BOOLEAN_SETTING_LABELS[key]}
                    {!isImplemented && (
                      <span className="ml-2 text-xs opacity-60 font-normal">Coming soon</span>
                    )}
                  </label>
                  <InfoTooltip content={SETTING_DESCRIPTIONS[key]} />
                </div>
                <ToggleSwitch
                  id={`setting-${key}`}
                  checked={draft[key]}
                  onChange={(value) => handleToggleChange(key, value)}
                  disabled={!isImplemented}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-(--copper-border)/30">
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-(--cream-dark) hover:text-(--cream) underline-offset-2 hover:underline transition-colors"
        >
          Reset to Defaults
        </button>
        <button type="button" onClick={handleSave} className="btn-copper text-sm py-2 px-6">
          Save Settings
        </button>
      </div>
    </Modal>
  );
};
