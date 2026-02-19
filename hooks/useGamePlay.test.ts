import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useGamePlay } from './useGamePlay';
import { Card } from '@/lib/game/cards';
import * as Y from 'yjs';

// Mock GameProvider
const mockDoc = new Y.Doc();
vi.mock('@/components/providers/GameProvider', () => ({
  useGame: () => ({ doc: mockDoc }),
}));

// Mock useGameState with controllable return values
const mockGameState = {
  currentTurn: 1 as number | null,
  discardPile: [] as Card[],
  status: 'PLAYING' as string,
};

vi.mock('@/hooks/useGameState', () => ({
  useGameState: () => mockGameState,
}));

describe('useGamePlay.canPlayCard', () => {
  it('should allow card with matching color', () => {
    mockGameState.discardPile = [{ id: 'd1', color: 'red', symbol: '5' }];
    const { result } = renderHook(() => useGamePlay(1));

    const card: Card = { id: 'c1', color: 'red', symbol: '9' };
    expect(result.current.canPlayCard(card)).toBe(true);
  });

  it('should allow card with matching symbol', () => {
    mockGameState.discardPile = [{ id: 'd1', color: 'red', symbol: '5' }];
    const { result } = renderHook(() => useGamePlay(1));

    const card: Card = { id: 'c1', color: 'blue', symbol: '5' };
    expect(result.current.canPlayCard(card)).toBe(true);
  });

  it('should allow wild cards regardless of top card', () => {
    mockGameState.discardPile = [{ id: 'd1', color: 'red', symbol: '5' }];
    const { result } = renderHook(() => useGamePlay(1));

    const wild: Card = { id: 'c1', symbol: 'wild' };
    const wildDraw4: Card = { id: 'c2', symbol: 'wild-draw4' };

    expect(result.current.canPlayCard(wild)).toBe(true);
    expect(result.current.canPlayCard(wildDraw4)).toBe(true);
  });

  it('should reject card with no color or symbol match', () => {
    mockGameState.discardPile = [{ id: 'd1', color: 'red', symbol: '5' }];
    const { result } = renderHook(() => useGamePlay(1));

    const card: Card = { id: 'c1', color: 'blue', symbol: '9' };
    expect(result.current.canPlayCard(card)).toBe(false);
  });

  it('should allow any card when top discard has no active color (wild first card)', () => {
    // Wild card as top discard with no color set
    mockGameState.discardPile = [{ id: 'd1', symbol: 'wild' }];
    const { result } = renderHook(() => useGamePlay(1));

    const card: Card = { id: 'c1', color: 'green', symbol: '3' };
    expect(result.current.canPlayCard(card)).toBe(true);
  });

  it('should reject all cards when discard pile is empty', () => {
    mockGameState.discardPile = [];
    const { result } = renderHook(() => useGamePlay(1));

    const card: Card = { id: 'c1', color: 'red', symbol: '5' };
    expect(result.current.canPlayCard(card)).toBe(false);
  });

  it('should allow action card with matching color', () => {
    mockGameState.discardPile = [{ id: 'd1', color: 'blue', symbol: '3' }];
    const { result } = renderHook(() => useGamePlay(1));

    const card: Card = { id: 'c1', color: 'blue', symbol: 'skip' };
    expect(result.current.canPlayCard(card)).toBe(true);
  });

  it('should allow action card with matching symbol', () => {
    mockGameState.discardPile = [{ id: 'd1', color: 'red', symbol: 'skip' }];
    const { result } = renderHook(() => useGamePlay(1));

    const card: Card = { id: 'c1', color: 'green', symbol: 'skip' };
    expect(result.current.canPlayCard(card)).toBe(true);
  });
});

describe('useGamePlay.isMyTurn', () => {
  it('should be true when currentTurn matches myClientId and status is PLAYING', () => {
    mockGameState.currentTurn = 1;
    mockGameState.status = 'PLAYING';
    const { result } = renderHook(() => useGamePlay(1));
    expect(result.current.isMyTurn).toBe(true);
  });

  it('should be false when currentTurn does not match', () => {
    mockGameState.currentTurn = 2;
    mockGameState.status = 'PLAYING';
    const { result } = renderHook(() => useGamePlay(1));
    expect(result.current.isMyTurn).toBe(false);
  });

  it('should be false when status is not PLAYING', () => {
    mockGameState.currentTurn = 1;
    mockGameState.status = 'LOBBY';
    const { result } = renderHook(() => useGamePlay(1));
    expect(result.current.isMyTurn).toBe(false);
  });

  it('should be false when myClientId is null', () => {
    mockGameState.currentTurn = 1;
    mockGameState.status = 'PLAYING';
    const { result } = renderHook(() => useGamePlay(null));
    expect(result.current.isMyTurn).toBe(false);
  });
});
