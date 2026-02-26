import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import { useGameEngine } from './useGameEngine';
import type { Card } from '@/lib/game/cards';

let mockDoc: Y.Doc;

vi.mock('@/components/providers/GameProvider', () => ({
  useGame: () => ({ doc: mockDoc }),
}));

const players = [
  { clientId: 1, name: 'P1', isHost: true },
  { clientId: 2, name: 'P2', isHost: false },
];

const setupPlayingState = () => {
  const gameStateMap = mockDoc.getMap('gameState');
  const dealtHandsMap = mockDoc.getMap('dealtHands');

  const topDiscard: Card = { id: 'top', color: 'red', symbol: '5' };
  const winningCard: Card = { id: 'win-card', color: 'red', symbol: '7' };
  const opponentCard: Card = { id: 'opp-card', symbol: 'wild' };

  gameStateMap.set('status', 'PLAYING');
  gameStateMap.set('currentTurn', 1);
  gameStateMap.set('turnOrder', [1, 2]);
  gameStateMap.set('direction', 1);
  gameStateMap.set('discardPile', [topDiscard]);
  gameStateMap.set('playerCardCounts', { 1: 1, 2: 1 });
  gameStateMap.set('scores', { 1: 0, 2: 0 });

  dealtHandsMap.set('1', [winningCard]);
  dealtHandsMap.set('2', [opponentCard]);
};

describe('useGameEngine score limit transitions', () => {
  beforeEach(() => {
    mockDoc = new Y.Doc();
  });

  it('keeps multi-round flow in ROUND_ENDED when scoreLimit is Infinity', () => {
    renderHook(() =>
      useGameEngine({
        players,
        myClientId: 1,
        startingHandSize: 7,
        isHost: true,
        scoreLimit: Infinity,
      })
    );

    setupPlayingState();

    act(() => {
      const actionsMap = mockDoc.getMap('actions');
      actionsMap.set('1', { type: 'PLAY_CARD', cardId: 'win-card' });
    });

    const gameStateMap = mockDoc.getMap('gameState');
    expect(gameStateMap.get('status')).toBe('ROUND_ENDED');
    expect(gameStateMap.get('winner')).toBe(1);
  });

  it('ends game in multi-round mode when finite score limit is reached', () => {
    renderHook(() =>
      useGameEngine({
        players,
        myClientId: 1,
        startingHandSize: 7,
        isHost: true,
        scoreLimit: 20,
      })
    );

    setupPlayingState();

    act(() => {
      const actionsMap = mockDoc.getMap('actions');
      actionsMap.set('1', { type: 'PLAY_CARD', cardId: 'win-card' });
    });

    const gameStateMap = mockDoc.getMap('gameState');
    expect(gameStateMap.get('status')).toBe('ENDED');
    expect(gameStateMap.get('winner')).toBe(1);
  });

  it('ends immediately in single-round mode when hand becomes empty', () => {
    renderHook(() =>
      useGameEngine({
        players,
        myClientId: 1,
        startingHandSize: 7,
        isHost: true,
        scoreLimit: null,
      })
    );

    setupPlayingState();

    act(() => {
      const actionsMap = mockDoc.getMap('actions');
      actionsMap.set('1', { type: 'PLAY_CARD', cardId: 'win-card' });
    });

    const gameStateMap = mockDoc.getMap('gameState');
    expect(gameStateMap.get('status')).toBe('ENDED');
    expect(gameStateMap.get('winner')).toBe(1);
  });
});
