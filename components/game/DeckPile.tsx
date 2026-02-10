'use client';

import { UnoCard } from '@/components/ui/UnoCard';
import { cn } from '@/lib/utils';

interface DeckPileProps {
  className?: string;
}

/**
 * Deck pile shown as stacked card backs with slight offset for depth illusion.
 * Uses UnoCard with symbol='back' for consistent sizing with the discard pile.
 */
export const DeckPile = ({ className }: DeckPileProps) => {
  return (
    <div className={cn('relative w-[80px] h-[120px]', className)}>
      {/* Stack layers for depth effect */}
      {[2, 1, 0].map((offset) => (
        <div
          key={offset}
          className="absolute"
          style={{
            top: -offset * 2,
            left: -offset * 1,
            zIndex: 3 - offset,
          }}
        >
          <UnoCard symbol="back" size="md" />
        </div>
      ))}
    </div>
  );
};
