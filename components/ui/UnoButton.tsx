'use client';

import { cn } from '@/lib/utils';

interface UnoButtonProps {
  /** Whether the player can call UNO (has 2 cards) */
  isEnabled: boolean;
  /** Callback when UNO button is clicked */
  onClick: () => void;
  /** Whether the user has already called UNO */
  hasCalledUno?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Circular UNO button displayed above the player's hand.
 * Visible at all times during gameplay, enabled when player has 2 cards.
 * Uses btn-copper styling for consistency with the game theme.
 */
export const UnoButton = ({
  isEnabled,
  onClick,
  hasCalledUno = false,
  className,
}: UnoButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isEnabled || hasCalledUno}
      className={cn(
        // Base styles - larger circular button with btn-copper appearance
        'btn-copper relative w-20 h-20 rounded-full flex items-center justify-center',
        'font-bold text-xl tracking-wider transition-all duration-200',
        // Disabled state - dimmed
        (!isEnabled || hasCalledUno) && 'opacity-50 cursor-not-allowed',
        // Pulse animation when enabled
        isEnabled && !hasCalledUno && 'animate-pulse',
        className
      )}
      aria-label={hasCalledUno ? 'UNO called' : isEnabled ? 'Call UNO' : 'Cannot call UNO yet'}
    >
      <span className="text-2xl font-black drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]">
        {hasCalledUno ? 'UNO!' : 'UNO'}
      </span>
    </button>
  );
};
