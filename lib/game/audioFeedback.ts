import { ACTION_SYMBOLS, Card, NUMBER_SYMBOLS, WILD_SYMBOLS } from '@/lib/game/cards';
import { GameStatus } from '@/hooks/useGameState';

interface OpponentUnoSignal {
  clientId: number;
  cardCount: number;
}

const NUMBER_SET = new Set<string>(NUMBER_SYMBOLS);
const ACTION_SET = new Set<string>(ACTION_SYMBOLS);
const WILD_SET = new Set<string>(WILD_SYMBOLS);

export const getTopCardId = (discardPile: Card[]): string | null => {
  if (discardPile.length === 0) return null;
  return discardPile[discardPile.length - 1].id;
};

export const getDiscardSoundForCard = (card: Card | null): string | null => {
  if (!card) return null;
  if (NUMBER_SET.has(card.symbol)) return '/sounds/play-card.wav';
  if (ACTION_SET.has(card.symbol) || WILD_SET.has(card.symbol)) return '/sounds/play-action-card.wav';
  return null;
};

export const didLocalTurnStart = (
  previousTurn: number | null,
  currentTurn: number | null,
  myClientId: number | null,
  status: GameStatus
): boolean => {
  if (status !== 'PLAYING' || myClientId === null) return false;
  return previousTurn !== myClientId && currentTurn === myClientId;
};

export const getOpponentsWithUnoBubbleAppearance = (
  opponents: OpponentUnoSignal[],
  previousVisibleByOpponent: Map<number, boolean>
): number[] => {
  const appearances: number[] = [];
  const nextVisibleByOpponent = new Map<number, boolean>();

  for (const opponent of opponents) {
    const isVisible = opponent.cardCount === 1;
    const wasVisible = previousVisibleByOpponent.get(opponent.clientId) ?? false;

    if (isVisible && !wasVisible) appearances.push(opponent.clientId);
    nextVisibleByOpponent.set(opponent.clientId, isVisible);
  }

  previousVisibleByOpponent.clear();
  nextVisibleByOpponent.forEach((visible, clientId) => {
    previousVisibleByOpponent.set(clientId, visible);
  });

  return appearances;
};

const getCountDeltaSummary = (
  previousCounts: Record<number, number>,
  nextCounts: Record<number, number>
): { positiveDeltaCount: number; positiveDeltaValue: number; hasNegativeDelta: boolean } => {
  const playerIds = new Set<number>([
    ...Object.keys(previousCounts).map(Number),
    ...Object.keys(nextCounts).map(Number),
  ]);

  let positiveDeltaCount = 0;
  let positiveDeltaValue = 0;
  let hasNegativeDelta = false;

  playerIds.forEach((playerId) => {
    const previous = previousCounts[playerId] ?? 0;
    const next = nextCounts[playerId] ?? 0;
    const delta = next - previous;

    if (delta > 0) {
      positiveDeltaCount += 1;
      positiveDeltaValue += delta;
    }
    if (delta < 0) hasNegativeDelta = true;
  });

  return { positiveDeltaCount, positiveDeltaValue, hasNegativeDelta };
};

export const didDrawActionOccur = (
  previousCounts: Record<number, number>,
  nextCounts: Record<number, number>,
  previousTopCardId: string | null,
  nextTopCardId: string | null
): boolean => {
  if (previousTopCardId === null || nextTopCardId === null) return false;
  if (previousTopCardId !== nextTopCardId) return false;

  const { positiveDeltaCount, positiveDeltaValue, hasNegativeDelta } = getCountDeltaSummary(previousCounts, nextCounts);

  return !hasNegativeDelta && positiveDeltaCount === 1 && positiveDeltaValue === 1;
};
