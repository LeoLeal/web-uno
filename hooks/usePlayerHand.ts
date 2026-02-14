/**
 * Hook for reading the local player's hand.
 *
 * Reads the player's dealt hand from the Yjs 'dealtHands' map (keyed by clientId),
 * then stores it locally. The hand is private — only the local player's entry is used.
 *
 * The hand is read-only from the player's perspective. Only the host modifies hands
 * via the Yjs dealtHandsMap (in useGameEngine).
 */

import { useState, useEffect } from 'react';
import { useGame } from '@/components/providers/GameProvider';
import { Card } from '@/lib/game/cards';

interface UsePlayerHandOptions {
  myClientId: number | null;
}

interface UsePlayerHandReturn {
  /** Current cards in the player's hand (read-only, synced from Yjs) */
  hand: Card[];
}

export const usePlayerHand = ({ myClientId }: UsePlayerHandOptions): UsePlayerHandReturn => {
  const { doc } = useGame();
  const [hand, setHand] = useState<Card[]>([]);

  // Watch the Yjs 'dealtHands' map for our entry
  useEffect(() => {
    if (!doc || myClientId === null) return;

    const dealtHandsMap = doc.getMap('dealtHands');
    const key = String(myClientId);

    const handleChange = () => {
      const myHand = dealtHandsMap.get(key) as Card[] | undefined;
      if (myHand && myHand.length > 0) {
        setHand(myHand);
      }
    };

    // Check if hand already exists (e.g. component re-mount)
    handleChange();

    dealtHandsMap.observe(handleChange);
    return () => {
      dealtHandsMap.unobserve(handleChange);
    };
  }, [doc, myClientId]);

  return { hand };
};
