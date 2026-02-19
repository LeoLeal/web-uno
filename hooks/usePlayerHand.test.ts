import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Y from 'yjs';
import { usePlayerHand } from './usePlayerHand';
import { Card } from '@/lib/game/cards';

// Mock the GameProvider
const mockDoc = new Y.Doc();

vi.mock('@/components/providers/GameProvider', () => ({
  useGame: () => ({ doc: mockDoc }),
}));

describe('usePlayerHand', () => {
  beforeEach(() => {
    const dealtHandsMap = mockDoc.getMap('dealtHands');
    dealtHandsMap.clear();
  });

  it('should return empty hand when no cards are dealt', () => {
    const { result } = renderHook(() => usePlayerHand({ myClientId: 1 }));
    expect(result.current.hand).toEqual([]);
  });

  it('should return empty hand when clientId is null', () => {
    const { result } = renderHook(() => usePlayerHand({ myClientId: null }));
    expect(result.current.hand).toEqual([]);
  });

  it('should read dealt hand from Yjs map', () => {
    const cards: Card[] = [
      { id: 'c1', color: 'red', symbol: '5' },
      { id: 'c2', color: 'blue', symbol: '7' },
    ];

    const dealtHandsMap = mockDoc.getMap('dealtHands');
    dealtHandsMap.set('1', cards);

    const { result } = renderHook(() => usePlayerHand({ myClientId: 1 }));
    expect(result.current.hand).toEqual(cards);
  });

  it('should update when hand changes in Yjs', () => {
    const initialCards: Card[] = [
      { id: 'c1', color: 'red', symbol: '5' },
    ];

    const dealtHandsMap = mockDoc.getMap('dealtHands');
    dealtHandsMap.set('1', initialCards);

    const { result } = renderHook(() => usePlayerHand({ myClientId: 1 }));
    expect(result.current.hand).toEqual(initialCards);

    const newCards: Card[] = [
      { id: 'c1', color: 'red', symbol: '5' },
      { id: 'c2', color: 'green', symbol: 'skip' },
      { id: 'c3', symbol: 'wild' },
    ];

    act(() => {
      dealtHandsMap.set('1', newCards);
    });

    expect(result.current.hand).toEqual(newCards);
  });

  it('should only read own hand, not other players', () => {
    const myCards: Card[] = [{ id: 'c1', color: 'red', symbol: '5' }];
    const otherCards: Card[] = [{ id: 'c2', color: 'blue', symbol: '9' }];

    const dealtHandsMap = mockDoc.getMap('dealtHands');
    dealtHandsMap.set('1', myCards);
    dealtHandsMap.set('2', otherCards);

    const { result } = renderHook(() => usePlayerHand({ myClientId: 1 }));
    expect(result.current.hand).toEqual(myCards);
  });
});
