/**
 * Hook for managing the local player's hand.
 *
 * Reads the player's dealt hand from the Yjs 'dealtHands' map (keyed by clientId),
 * then stores it locally. The hand is private — only the local player's entry is used.
 *
 * Also supports adding/removing cards for gameplay (draw, play actions).
 */

import { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/components/providers/GameProvider';
import { Card } from '@/lib/game/cards';

interface UsePlayerHandOptions {
  myClientId: number | null;
}

interface UsePlayerHandReturn {
  /** Current cards in the player's hand */
  hand: Card[];
  /** Set the entire hand (used when receiving dealt cards) */
  setHand: (cards: Card[]) => void;
  /** Add a card to the hand (e.g., drawing from deck) */
  addCard: (card: Card) => void;
  /** Remove a card from the hand by ID (e.g., playing a card) */
  removeCard: (cardId: string) => Card | undefined;
  /** Clear the entire hand */
  clearHand: () => void;
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

  const addCard = useCallback((card: Card) => {
    setHand((prev) => [...prev, card]);
  }, []);

  const removeCard = useCallback((cardId: string): Card | undefined => {
    let removed: Card | undefined;
    setHand((prev) => {
      const index = prev.findIndex((c) => c.id === cardId);
      if (index === -1) return prev;
      removed = prev[index];
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
    return removed;
  }, []);

  const clearHand = useCallback(() => {
    setHand([]);
  }, []);

  return { hand, setHand, addCard, removeCard, clearHand };
};
