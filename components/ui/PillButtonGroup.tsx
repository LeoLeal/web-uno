'use client';

import { useCallback, useRef } from 'react';
import { clsx } from 'clsx';
import styles from './PillButtonGroup.module.css';

interface PillButtonGroupOption<T> {
  value: T;
  label: string;
}

interface PillButtonGroupProps<T extends string | number | null> {
  /** Array of options to display */
  options: PillButtonGroupOption<T>[];
  /** Currently selected value */
  value: T;
  /** Called when selection changes */
  onChange: (value: T) => void;
  /** Whether the group is disabled */
  disabled?: boolean;
  /** Accessible label for the group */
  'aria-label': string;
}

/**
 * Pill button group for selecting from discrete options.
 * Uses radiogroup semantics for accessibility.
 */
export const PillButtonGroup = <T extends string | number | null>({
  options,
  value,
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
}: PillButtonGroupProps<T>) => {
  const groupRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      if (disabled) return;

      let nextIndex: number | null = null;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = (currentIndex + 1) % options.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = (currentIndex - 1 + options.length) % options.length;
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          onChange(options[currentIndex].value);
          return;
        default:
          return;
      }

      if (nextIndex !== null) {
        // Focus and select the next option
        const buttons = groupRef.current?.querySelectorAll('button');
        if (buttons?.[nextIndex]) {
          (buttons[nextIndex] as HTMLButtonElement).focus();
          onChange(options[nextIndex].value);
        }
      }
    },
    [disabled, onChange, options]
  );

  const handleClick = useCallback(
    (optionValue: T) => {
      if (!disabled && optionValue !== value) {
        onChange(optionValue);
      }
    },
    [disabled, onChange, value]
  );

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={ariaLabel}
      className={styles.group}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => handleClick(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={clsx(styles.button, isSelected && styles.checked)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
