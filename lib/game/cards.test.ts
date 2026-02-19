import { describe, it, expect } from 'vitest';
import {
  isWildCard,
  isWildDrawFour,
  isActionCard,
  isNumberCard,
  Card,
} from './cards';

describe('Card predicates', () => {
  describe('isWildCard', () => {
    it('should return true for wild', () => {
      const card: Card = { id: '1', symbol: 'wild' };
      expect(isWildCard(card)).toBe(true);
    });

    it('should return true for wild-draw4', () => {
      const card: Card = { id: '2', symbol: 'wild-draw4' };
      expect(isWildCard(card)).toBe(true);
    });

    it('should return false for number cards', () => {
      const card: Card = { id: '3', color: 'red', symbol: '5' };
      expect(isWildCard(card)).toBe(false);
    });

    it('should return false for action cards', () => {
      const card: Card = { id: '4', color: 'blue', symbol: 'skip' };
      expect(isWildCard(card)).toBe(false);
    });
  });

  describe('isWildDrawFour', () => {
    it('should return true for wild-draw4', () => {
      const card: Card = { id: '1', symbol: 'wild-draw4' };
      expect(isWildDrawFour(card)).toBe(true);
    });

    it('should return false for regular wild', () => {
      const card: Card = { id: '2', symbol: 'wild' };
      expect(isWildDrawFour(card)).toBe(false);
    });

    it('should return false for non-wild cards', () => {
      const card: Card = { id: '3', color: 'green', symbol: 'draw2' };
      expect(isWildDrawFour(card)).toBe(false);
    });
  });

  describe('isActionCard', () => {
    it('should return true for skip', () => {
      const card: Card = { id: '1', color: 'red', symbol: 'skip' };
      expect(isActionCard(card)).toBe(true);
    });

    it('should return true for reverse', () => {
      const card: Card = { id: '2', color: 'blue', symbol: 'reverse' };
      expect(isActionCard(card)).toBe(true);
    });

    it('should return true for draw2', () => {
      const card: Card = { id: '3', color: 'green', symbol: 'draw2' };
      expect(isActionCard(card)).toBe(true);
    });

    it('should return false for number cards', () => {
      const card: Card = { id: '4', color: 'yellow', symbol: '9' };
      expect(isActionCard(card)).toBe(false);
    });

    it('should return false for wild cards', () => {
      const card: Card = { id: '5', symbol: 'wild' };
      expect(isActionCard(card)).toBe(false);
    });
  });

  describe('isNumberCard', () => {
    it('should return true for 0', () => {
      const card: Card = { id: '1', color: 'red', symbol: '0' };
      expect(isNumberCard(card)).toBe(true);
    });

    it('should return true for 9', () => {
      const card: Card = { id: '2', color: 'blue', symbol: '9' };
      expect(isNumberCard(card)).toBe(true);
    });

    it('should return true for middle numbers', () => {
      const card: Card = { id: '3', color: 'green', symbol: '5' };
      expect(isNumberCard(card)).toBe(true);
    });

    it('should return false for skip', () => {
      const card: Card = { id: '4', color: 'red', symbol: 'skip' };
      expect(isNumberCard(card)).toBe(false);
    });

    it('should return false for reverse', () => {
      const card: Card = { id: '5', color: 'blue', symbol: 'reverse' };
      expect(isNumberCard(card)).toBe(false);
    });

    it('should return false for draw2', () => {
      const card: Card = { id: '6', color: 'green', symbol: 'draw2' };
      expect(isNumberCard(card)).toBe(false);
    });

    it('should return false for wild', () => {
      const card: Card = { id: '7', symbol: 'wild' };
      expect(isNumberCard(card)).toBe(false);
    });

    it('should return false for wild-draw4', () => {
      const card: Card = { id: '8', symbol: 'wild-draw4' };
      expect(isNumberCard(card)).toBe(false);
    });
  });
});
