import { useEffect, useMemo, useRef } from 'react';
import { playSound, speakText } from '@/lib/audio/playback';
import {
  didDrawActionOccur,
  didLocalTurnStart,
  getDiscardSoundForCard,
  getTopCardId,
} from '@/lib/game/audioFeedback';
import { Card } from '@/lib/game/cards';
import { GameStatus } from '@/hooks/useGameState';

interface UseGameAudioFeedbackProps {
  status: GameStatus;
  myClientId: number | null;
  currentTurn: number | null;
  discardPile: Card[];
  playerCardCounts: Record<number, number>;
  isMuted: boolean;
}

export const useGameAudioFeedback = ({
  status,
  myClientId,
  currentTurn,
  discardPile,
  playerCardCounts,
  isMuted,
}: UseGameAudioFeedbackProps): void => {
  const previousTurnRef = useRef<number | null>(null);
  const previousTopCardIdRef = useRef<string | null>(null);
  const previousCountsRef = useRef<Record<number, number>>({});

  const topCard = useMemo(() => {
    if (discardPile.length === 0) return null;
    return discardPile[discardPile.length - 1];
  }, [discardPile]);

  useEffect(() => {
    if (status !== 'PLAYING') {
      previousTurnRef.current = currentTurn;
      return;
    }

    if (!isMuted && didLocalTurnStart(previousTurnRef.current, currentTurn, myClientId, status)) {
      speakText('Your turn!');
    }

    previousTurnRef.current = currentTurn;
  }, [status, currentTurn, myClientId, isMuted]);

  useEffect(() => {
    const previousTopCardId = previousTopCardIdRef.current;
    const nextTopCardId = getTopCardId(discardPile);

    if (status === 'PLAYING' && !isMuted && previousTopCardId && nextTopCardId !== previousTopCardId) {
      const discardSound = getDiscardSoundForCard(topCard);
      if (discardSound) {
        void playSound(discardSound);
      }
    }

    if (
      status === 'PLAYING' &&
      !isMuted &&
      didDrawActionOccur(previousCountsRef.current, playerCardCounts, previousTopCardId, nextTopCardId)
    ) {
      void playSound('/sounds/draw-card.mp3');
    }

    previousTopCardIdRef.current = nextTopCardId;
    previousCountsRef.current = playerCardCounts;
  }, [status, discardPile, playerCardCounts, isMuted, topCard]);
};
