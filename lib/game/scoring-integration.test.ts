import { describe, it, expect } from 'vitest';
import { calculateHandPoints } from './scoring';
import { Card } from './cards';

/**
 * Integration tests for round score calculation using real calculateHandPoints.
 */

describe('Round score calculation', () => {
  it('should sum all opponents hand points and credit winner', () => {
    const winnerId = 1;
    const opponentHands: Record<number, Card[]> = {
      2: [
        { id: '1', color: 'red', symbol: '5' },
        { id: '2', color: 'blue', symbol: '7' },
      ],
      3: [
        { id: '3', color: 'yellow', symbol: 'skip' },
        { id: '4', color: 'green', symbol: 'draw2' },
      ],
    };

    let totalRoundPoints = 0;
    for (const [playerId, hand] of Object.entries(opponentHands)) {
      if (Number(playerId) !== winnerId) {
        totalRoundPoints += calculateHandPoints(hand);
      }
    }

    // Player 2: 5 + 7 = 12
    // Player 3: 20 + 20 = 40
    // Total: 52
    expect(totalRoundPoints).toBe(52);
  });

  it('should include orphan hands in score calculation', () => {
    const winnerId = 1;

    // Active opponent hands
    const opponentHands: Record<number, Card[]> = {
      2: [
        { id: '1', color: 'red', symbol: '3' },
      ],
    };

    // Orphan hands from disconnected players
    const orphanHands = [
      {
        originalClientId: 3,
        originalName: 'Disconnected',
        cards: [
          { id: '2', color: 'blue', symbol: '7' },
          { id: '3', symbol: 'wild' },
        ] as Card[],
      },
    ];

    // Calculate from active opponents
    let totalRoundPoints = 0;
    for (const [playerId, hand] of Object.entries(opponentHands)) {
      if (Number(playerId) !== winnerId) {
        totalRoundPoints += calculateHandPoints(hand);
      }
    }

    // Add orphan hands
    for (const orphan of orphanHands) {
      totalRoundPoints += calculateHandPoints(orphan.cards);
    }

    // Active: 3
    // Orphan: 7 + 50 = 57
    // Total: 60
    expect(totalRoundPoints).toBe(60);
  });

  it('should handle multiple orphan hands correctly', () => {
    const orphanHands = [
      {
        originalClientId: 2,
        originalName: 'Player2',
        cards: [
          { id: '1', color: 'red', symbol: '5' },
        ] as Card[],
      },
      {
        originalClientId: 3,
        originalName: 'Player3',
        cards: [
          { id: '2', color: 'blue', symbol: 'skip' },
        ] as Card[],
      },
      {
        originalClientId: 4,
        originalName: 'Player4',
        cards: [
          { id: '3', symbol: 'wild-draw4' },
        ] as Card[],
      },
    ];

    let totalRoundPoints = 0;
    for (const orphan of orphanHands) {
      totalRoundPoints += calculateHandPoints(orphan.cards);
    }

    // 5 + 20 + 50 = 75
    expect(totalRoundPoints).toBe(75);
  });

  it('should not add points from empty hands', () => {
    const winnerId = 1;
    const opponentHands: Record<number, Card[]> = {
      2: [], // Empty hand (winner)
    };

    let totalRoundPoints = 0;
    for (const [playerId, hand] of Object.entries(opponentHands)) {
      if (Number(playerId) !== winnerId) {
        totalRoundPoints += calculateHandPoints(hand);
      }
    }

    expect(totalRoundPoints).toBe(0);
  });
});
