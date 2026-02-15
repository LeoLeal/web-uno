import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameEndModal } from './GameEndModal';

describe('GameEndModal', () => {
  describe('Basic Rendering', () => {
    it('should render when open', () => {
      render(<GameEndModal isOpen={true} isWinner={true} endType="WIN" />);
      expect(screen.getByText(/You Win/i)).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(<GameEndModal isOpen={false} isWinner={true} endType="WIN" />);
      expect(screen.queryByText(/You Win/i)).not.toBeInTheDocument();
    });
  });

  describe('Single-round game (victory)', () => {
    it('should show winner title', () => {
      render(<GameEndModal isOpen={true} isWinner={true} endType="WIN" />);
      expect(screen.getByText('You Win! 🎉')).toBeInTheDocument();
    });

    it('should show winner trophy', () => {
      render(<GameEndModal isOpen={true} isWinner={true} endType="WIN" />);
      expect(screen.getByText('🏆')).toBeInTheDocument();
    });

    it('should show congratulations message', () => {
      render(<GameEndModal isOpen={true} isWinner={true} endType="WIN" />);
      expect(screen.getByText(/got rid of all your cards/i)).toBeInTheDocument();
    });

    it('should show celebration note', () => {
      render(<GameEndModal isOpen={true} isWinner={true} endType="WIN" />);
      expect(screen.getByText(/Well played/i)).toBeInTheDocument();
    });

    it('should show back to lobby button', () => {
      render(<GameEndModal isOpen={true} isWinner={true} endType="WIN" />);
      expect(screen.getByRole('link', { name: /Back to Lobby/i })).toBeInTheDocument();
    });
  });

  describe('Single-round game (loss)', () => {
    it('should show game over title', () => {
      render(<GameEndModal isOpen={true} isWinner={false} endType="WIN" />);
      expect(screen.getByText('Game Over')).toBeInTheDocument();
    });

    it('should show sad face', () => {
      render(<GameEndModal isOpen={true} isWinner={false} endType="WIN" />);
      expect(screen.getByText('😔')).toBeInTheDocument();
    });

    it('should show better luck message', () => {
      render(<GameEndModal isOpen={true} isWinner={false} endType="WIN" />);
      expect(screen.getByText(/Better luck next time/i)).toBeInTheDocument();
    });

    it('should not show celebration note', () => {
      render(<GameEndModal isOpen={true} isWinner={false} endType="WIN" />);
      expect(screen.queryByText(/Well played/i)).not.toBeInTheDocument();
    });
  });

  describe('Insufficient players (game abandoned)', () => {
    it('should show game ended title', () => {
      render(<GameEndModal isOpen={true} isWinner={false} endType="INSUFFICIENT_PLAYERS" />);
      expect(screen.getByText('Game Ended')).toBeInTheDocument();
    });

    it('should show insufficient players message', () => {
      render(<GameEndModal isOpen={true} isWinner={false} endType="INSUFFICIENT_PLAYERS" />);
      expect(screen.getByText(/Not enough players to continue/i)).toBeInTheDocument();
    });

    it('should show explanation note', () => {
      render(<GameEndModal isOpen={true} isWinner={false} endType="INSUFFICIENT_PLAYERS" />);
      expect(screen.getByText(/Too many players disconnected/i)).toBeInTheDocument();
    });

    it('should show back to lobby button', () => {
      render(<GameEndModal isOpen={true} isWinner={false} endType="INSUFFICIENT_PLAYERS" />);
      expect(screen.getByRole('link', { name: /Back to Lobby/i })).toBeInTheDocument();
    });
  });

  describe('Multi-round game with standings', () => {
    const standings = [
      { clientId: 1, name: 'Alice', score: 550 },
      { clientId: 2, name: 'Bob', score: 300 },
      { clientId: 3, name: 'Charlie', score: 150 },
    ];

    it('should show final standings section', () => {
      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          endType="WIN"
          isMultiRound={true}
          standings={standings}
        />
      );
      expect(screen.getByText('Final Standings')).toBeInTheDocument();
    });

    it('should display all players in standings', () => {
      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          endType="WIN"
          isMultiRound={true}
          standings={standings}
        />
      );
      expect(screen.getByText(/1\. Alice/)).toBeInTheDocument();
      expect(screen.getByText(/2\. Bob/)).toBeInTheDocument();
      expect(screen.getByText(/3\. Charlie/)).toBeInTheDocument();
    });

    it('should display scores for all players', () => {
      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          endType="WIN"
          isMultiRound={true}
          standings={standings}
        />
      );
      expect(screen.getByText('550 pts')).toBeInTheDocument();
      expect(screen.getByText('300 pts')).toBeInTheDocument();
      expect(screen.getByText('150 pts')).toBeInTheDocument();
    });

    it('should show winner message for multi-round', () => {
      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          endType="WIN"
          isMultiRound={true}
          standings={standings}
        />
      );
      expect(screen.getByText(/reached the score limit first/i)).toBeInTheDocument();
    });

    it('should show loser message for multi-round', () => {
      render(
        <GameEndModal
          isOpen={true}
          isWinner={false}
          endType="WIN"
          isMultiRound={true}
          standings={standings}
        />
      );
      expect(screen.getByText(/Someone reached the score limit/i)).toBeInTheDocument();
    });

    it('should not show celebration note in multi-round', () => {
      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          endType="WIN"
          isMultiRound={true}
          standings={standings}
        />
      );
      expect(screen.queryByText(/Well played/i)).not.toBeInTheDocument();
    });

    it('should handle 2-player standings', () => {
      const twoPlayerStandings = [
        { clientId: 1, name: 'Alice', score: 500 },
        { clientId: 2, name: 'Bob', score: 300 },
      ];

      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          endType="WIN"
          isMultiRound={true}
          standings={twoPlayerStandings}
        />
      );

      expect(screen.getByText(/1\. Alice/)).toBeInTheDocument();
      expect(screen.getByText(/2\. Bob/)).toBeInTheDocument();
    });

    it('should handle 4+ player standings', () => {
      const manyPlayerStandings = [
        { clientId: 1, name: 'Alice', score: 600 },
        { clientId: 2, name: 'Bob', score: 500 },
        { clientId: 3, name: 'Charlie', score: 400 },
        { clientId: 4, name: 'David', score: 300 },
        { clientId: 5, name: 'Eve', score: 200 },
      ];

      render(
        <GameEndModal
          isOpen={true}
          isWinner={false}
          endType="WIN"
          isMultiRound={true}
          standings={manyPlayerStandings}
        />
      );

      expect(screen.getByText(/1\. Alice/)).toBeInTheDocument();
      expect(screen.getByText(/5\. Eve/)).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty standings array', () => {
      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          endType="WIN"
          isMultiRound={true}
          standings={[]}
        />
      );

      // Should not crash, standings section should not show
      expect(screen.queryByText('Final Standings')).not.toBeInTheDocument();
    });

    it('should handle undefined standings', () => {
      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          endType="WIN"
          isMultiRound={true}
        />
      );

      // Should not crash, standings section should not show
      expect(screen.queryByText('Final Standings')).not.toBeInTheDocument();
    });

    it('should handle single player in standings', () => {
      const singleStanding = [
        { clientId: 1, name: 'Alice', score: 500 },
      ];

      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          endType="WIN"
          isMultiRound={true}
          standings={singleStanding}
        />
      );

      expect(screen.getByText(/1\. Alice/)).toBeInTheDocument();
      expect(screen.getByText('500 pts')).toBeInTheDocument();
    });

    it('should handle zero scores', () => {
      const zeroScores = [
        { clientId: 1, name: 'Alice', score: 0 },
        { clientId: 2, name: 'Bob', score: 0 },
      ];

      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          endType="WIN"
          isMultiRound={true}
          standings={zeroScores}
        />
      );

      expect(screen.getAllByText('0 pts')).toHaveLength(2);
    });

    it('should handle null endType (defaults to WIN view)', () => {
      render(<GameEndModal isOpen={true} isWinner={true} endType={null} />);
      expect(screen.getByText('You Win! 🎉')).toBeInTheDocument();
    });
  });
});
