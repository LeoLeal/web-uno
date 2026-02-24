'use client';

import { Card } from '@/lib/game/cards';
import { UnoCard } from '@/components/ui/UnoCard';
import { ChatInput } from './ChatInput';
import { cn } from '@/lib/utils';

interface PlayerHandProps {
  cards: Card[];
  isMyTurn?: boolean;
  onCardClick?: (card: Card) => void;
  canPlayCard?: (card: Card) => boolean;
  score?: number;
  showScore?: boolean;
  onSendMessage?: (text: string) => void;
  className?: string;
}

/**
 * Displays the player's hand as a fanned arc of cards at the bottom of the screen.
 * Cards are rotated to follow an arc curve with the center card highest.
 * Cards scale to fit within the screen width.
 */
export const PlayerHand = ({
  cards,
  isMyTurn = false,
  onCardClick,
  canPlayCard,
  score,
  showScore = false,
  onSendMessage,
  className
}: PlayerHandProps) => {
  const cardCount = cards.length;

  /**
   * Calculate card spacing to fit within screen width.
   * More cards = tighter spacing.
   */
  const getCardSpacing = (): number => {
    // Card width in pixels (size="md" = 80px)
    const cardWidth = 80;
    // Available width (assuming ~90% of viewport on mobile, full on desktop)
    const availableWidth = typeof window !== 'undefined' 
      ? (window.innerWidth < 768 ? window.innerWidth * 0.9 : 600)
      : 600;
    
    if (cardCount <= 1) return 0;
    
    // Calculate how much overlap we need
    const totalCardsWidth = cardCount * cardWidth;
    const overlapNeeded = totalCardsWidth - availableWidth;
    
    // Convert to negative margin (overlap)
    // Minimum overlap is -12 (for few cards), maximum is -50 (for many cards)
    const spacing = Math.max(-50, Math.min(-12, -overlapNeeded / (cardCount - 1)));
    
    return spacing;
  };

  /**
   * Calculate fan angle and vertical offset for each card.
   * More cards = tighter spacing.
   */
  const getCardTransform = (index: number): { rotation: number; translateY: number } => {
    if (cardCount <= 1) return { rotation: 0, translateY: 0 };

    // Max total fan angle scales with card count but caps out
    const maxFanAngle = Math.min(cardCount * 5, 60);
    const angleStep = maxFanAngle / (cardCount - 1);
    const startAngle = -maxFanAngle / 2;
    const rotation = startAngle + index * angleStep;

    // Parabolic vertical offset: center cards are highest
    const normalizedPos = (index / (cardCount - 1)) * 2 - 1; // -1 to 1
    const translateY = normalizedPos * normalizedPos * 20; // Parabolic curve

    return { rotation, translateY };
  };

  // Calculate spacing once per render
  const cardSpacing = getCardSpacing();

  return (
    <div className={cn('fixed bottom-0 left-0 right-0 flex items-end justify-center pb-8 md:pb-6', className)}>
      {/* Turn indicator glow */}
      {isMyTurn && (
        <div className="absolute -inset-0 rounded-3xl bg-yellow-400/10 border border-yellow-400/30 animate-pulse pointer-events-none" />
      )}

      <div className="flex items-end justify-center" style={{ minHeight: 140 }}>
        {cards.map((card, index) => {
          const { rotation, translateY } = getCardTransform(index);
          const marginLeft = index === 0 ? 0 : cardSpacing;
          const isPlayable = canPlayCard ? canPlayCard(card) : true;
          const canClick = isMyTurn && onCardClick && isPlayable;

          return (
            <div
              key={card.id}
              onClick={() => canClick && onCardClick(card)}
              className={cn(
                "transition-transform duration-200 ease-out",
                canClick && "hover:-translate-y-6 hover:z-50 cursor-pointer",
                isMyTurn && !isPlayable && "cursor-not-allowed",
                !isMyTurn && "cursor-default"
              )}
              style={{
                marginLeft,
                transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
                zIndex: index,
              }}
            >
              <UnoCard
                color={card.color}
                symbol={card.symbol}
                size="md"
              />
            </div>
          );
        })}
      </div>

      {/* "Your turn" label */}
      {isMyTurn && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 text-sm font-bold uppercase tracking-widest animate-bounce z-40">
          Your Turn!
        </div>
      )}

      {/* Chat Input Overlay — desktop only. On mobile, ChatInput lives in the top Drawer. */}
      {onSendMessage && (
        <div className={cn(
          "hidden md:block w-full max-w-[300px] sm:max-w-xs md:max-w-md px-2 sm:px-4 absolute transition-all duration-300 z-50",
          isMyTurn ? "bottom-[220px]" : "bottom-[220px]"
        )}>
          <ChatInput onSendMessage={onSendMessage} />
        </div>
      )}

      {/* Player score (multi-round games only) */}
      {showScore && (
        <div className="absolute -top-8 right-8 text-sm text-(--cream-dark) opacity-70 font-medium">
          {score ?? 0} pts
        </div>
      )}
    </div>
  );
};
