'use client';

import { useCallback } from 'react';

interface ToggleSwitchProps {
  /** Whether the switch is on */
  checked: boolean;
  /** Called when the switch is toggled */
  onChange: (checked: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** ID for the switch element */
  id?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
  /** ID of element that labels this switch */
  'aria-labelledby'?: string;
}

/**
 * Toggle switch component for boolean settings.
 * Uses role="switch" for proper accessibility semantics.
 */
export const ToggleSwitch = ({
  checked,
  onChange,
  disabled = false,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: ToggleSwitchProps) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onChange(!checked);
    }
  }, [checked, disabled, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onChange(!checked);
      }
    },
    [checked, disabled, onChange]
  );

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="toggle-switch"
    >
      <span className="toggle-switch__track" aria-hidden="true" />
      <span className="toggle-switch__thumb" aria-hidden="true" />
    </button>
  );
};
