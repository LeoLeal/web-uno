import { describe, expect, it } from 'vitest';
import { Card } from '@/lib/game/cards';
import {
  didLocalTurnStart,
  getDiscardSoundForCard,
  getOpponentsWithUnoBubbleAppearance,
  didDrawActionOccur,
} from '@/lib/game/audioFeedback';

describe('audioFeedback helpers', () => {
  describe('getDiscardSoundForCard', () => {
    it('returns play-card clip for number symbols', () => {
      const topCard: Card = { id: 'c1', color: 'red', symbol: '7' };
      expect(getDiscardSoundForCard(topCard)).toBe('/sounds/play-card.wav');
    });

    it('returns action clip for action and wild symbols', () => {
      expect(getDiscardSoundForCard({ id: 'c2', color: 'blue', symbol: 'skip' })).toBe('/sounds/play-action-card.wav');
      expect(getDiscardSoundForCard({ id: 'c3', symbol: 'wild' })).toBe('/sounds/play-action-card.wav');
    });

    it('returns null when there is no card', () => {
      expect(getDiscardSoundForCard(null)).toBeNull();
    });
  });

  describe('didLocalTurnStart', () => {
    it('is true only on transition to local player while playing', () => {
      expect(didLocalTurnStart(2, 1, 1, 'PLAYING')).toBe(true);
      expect(didLocalTurnStart(1, 1, 1, 'PLAYING')).toBe(false);
      expect(didLocalTurnStart(2, 1, 1, 'LOBBY')).toBe(false);
    });
  });

  describe('getOpponentsWithUnoBubbleAppearance', () => {
    it('returns opponent id only when UNO bubble appears', () => {
      const previous = new Map<number, boolean>([[2, false]]);
      const appearances = getOpponentsWithUnoBubbleAppearance(
        [{ clientId: 2, cardCount: 1 }],
        previous
      );

      expect(appearances).toEqual([2]);
      expect(previous.get(2)).toBe(true);
    });

    it('does not return id while UNO bubble remains visible', () => {
      const previous = new Map<number, boolean>([[2, true]]);
      const appearances = getOpponentsWithUnoBubbleAppearance(
        [{ clientId: 2, cardCount: 1 }],
        previous
      );

      expect(appearances).toEqual([]);
    });
  });

  describe('didDrawActionOccur', () => {
    it('detects draw-card outcome when top discard does not change and one count increases by 1', () => {
      const prevCounts = { 1: 7, 2: 6 };
      const nextCounts = { 1: 8, 2: 6 };

      expect(didDrawActionOccur(prevCounts, nextCounts, 'top-1', 'top-1')).toBe(true);
    });

    it('does not detect draw when top discard changes', () => {
      const prevCounts = { 1: 7, 2: 6 };
      const nextCounts = { 1: 8, 2: 6 };

      expect(didDrawActionOccur(prevCounts, nextCounts, 'top-1', 'top-2')).toBe(false);
    });

    it('does not detect draw for +2 outcomes', () => {
      const prevCounts = { 1: 7, 2: 6 };
      const nextCounts = { 1: 7, 2: 8 };

      expect(didDrawActionOccur(prevCounts, nextCounts, 'top-1', 'top-1')).toBe(false);
    });
  });
});
