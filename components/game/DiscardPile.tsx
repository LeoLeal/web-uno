'use client';

import { Card } from '@/lib/game/cards';
import { UnoCard } from '@/components/ui/UnoCard';
import { cn } from '@/lib/utils';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './DiscardPile.module.css';

interface DiscardPileProps {
  cards: Card[];
  className?: string;
  /** Card dimensions - defaults to mobile size (80x120) */
  cardWidth?: number;
  cardHeight?: number;
  /** Client ID of the player who last played a card */
  lastPlayedBy: number | null;
  /** Current player's client ID */
  myClientId: number | null;
}

const VISIBLE_DISCARD_COUNT = 3;

const DEFAULT_WIDTH = 80;
const DEFAULT_HEIGHT = 120;

interface CardTransform {
  rotation: number;
  offsetX: number;
  offsetY: number;
}

const transformCacheByInstance = new Map<string, Record<string, CardTransform>>();
const entranceRotationCacheByInstance = new Map<string, Record<string, number>>();

const createRandomTransform = (): CardTransform => ({
  rotation: Math.random() * 60 - 30,
  offsetX: Math.random() * 12 - 6,
  offsetY: Math.random() * 12 - 6,
});

const createRandomEntranceRotation = (): number => Math.random() * 840 - 420; // -420 to 420

/**
 * Discard pile with stacked cards featuring random rotation/offset for organic look.
 * Shows up to the last VISIBLE_DISCARD_COUNT cards with the top card fully visible.
 * Animate entrance of newly played cards based on who played them.
 */
export const DiscardPile = ({ 
  cards, 
  className, 
  cardWidth = DEFAULT_WIDTH, 
  cardHeight = DEFAULT_HEIGHT,
  lastPlayedBy,
  myClientId,
}: DiscardPileProps) => {
  const visibleCards = cards.slice(-VISIBLE_DISCARD_COUNT);
  const instanceId = useId();

  // Track top card transitions for animation
  const topCardId = visibleCards[visibleCards.length - 1]?.id ?? null;
  const [animatedTopCardId, setAnimatedTopCardId] = useState<string | null>(null);
  const previousTopCardIdRef = useRef<string | null>(null);
  const hasMountedRef = useRef(false);

  // Detect top-card transitions after mount to trigger entrance animations.
  // We use useEffect + setState instead of useMemo because:
  // 1. Writing to previousTopCardIdRef during render (in useMemo) is a side effect
  // 2. The one-frame delay ensures the card renders in its final position first,
  //    then the animation class is applied, triggering the entrance animation cleanly
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      previousTopCardIdRef.current = topCardId;
      return;
    }

    if (topCardId !== previousTopCardIdRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimatedTopCardId(topCardId);
    } else {
      setAnimatedTopCardId(null);
    }

    previousTopCardIdRef.current = topCardId;
  }, [topCardId]);

  // Stable transforms for all visible cards
  const transformsById = useMemo(() => {
    const previousTransforms = transformCacheByInstance.get(instanceId) || {};
    const nextTransforms: Record<string, CardTransform> = {};

    for (const card of visibleCards) {
      nextTransforms[card.id] = previousTransforms[card.id] || createRandomTransform();
    }

    transformCacheByInstance.set(instanceId, nextTransforms);

    return nextTransforms;
  }, [instanceId, visibleCards]);

  // Entrance rotation cache for animated cards
  const entranceRotations = useMemo(() => {
    const previousRotations = entranceRotationCacheByInstance.get(instanceId) || {};
    const nextRotations: Record<string, number> = {};

    for (const card of visibleCards) {
      nextRotations[card.id] = previousRotations[card.id] ?? createRandomEntranceRotation();
    }

    entranceRotationCacheByInstance.set(instanceId, nextRotations);

    return nextRotations;
  }, [instanceId, visibleCards]);

  // Determine animation direction based on who played the card
  const animationClass = lastPlayedBy === myClientId 
    ? styles.enterFromBottom 
    : styles.enterFromTop;

  useEffect(() => {
    return () => {
      transformCacheByInstance.delete(instanceId);
      entranceRotationCacheByInstance.delete(instanceId);
    };
  }, [instanceId]);

  if (cards.length === 0) {
    return (
      <div
        className={cn(
          'rounded-lg border-2 border-dashed border-(--copper-border)/30 flex items-center justify-center',
          className
        )}
        style={{ width: cardWidth, height: cardHeight }}
      >
        <span className="text-(--cream-dark) opacity-30 text-xs">Discard</span>
      </div>
    );
  }

  return (
      <div className={cn('relative', className)} style={{ width: cardWidth, height: cardHeight }}>
      {visibleCards.map((card, i) => {
        const transform = transformsById[card.id] || { rotation: 0, offsetX: 0, offsetY: 0 };
        const entranceRotation = entranceRotations[card.id] ?? 0;
        const shouldAnimate = card.id === animatedTopCardId && lastPlayedBy !== null;

        return (
          <div
            key={card.id}
            className={cn(
              'absolute inset-0',
              shouldAnimate && animationClass
            )}
            style={{
              '--entrance-rotation-start': `${entranceRotation}deg`,
              '--final-rotation': `${transform.rotation}deg`,
              '--final-offset-x': `${transform.offsetX}px`,
              '--final-offset-y': `${transform.offsetY}px`,
              ...(shouldAnimate ? {} : {
                transform: `rotate(${transform.rotation}deg) translate(${transform.offsetX}px, ${transform.offsetY}px)`,
              }),
              zIndex: i
            } as React.CSSProperties}
          >
            <UnoCard
              color={card.color}
              symbol={card.symbol}
              style={{ width: cardWidth, height: cardHeight }}
            />
          </div>
        );
      })}
    </div>
  );
};
