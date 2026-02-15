import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameEndModal } from './GameEndModal';

describe('GameEndModal', () => {
  describe('Basic Rendering', () => {
    it('should render when open', () => {
      render(<GameEndModal isOpen={true} isWinner={true} />);
      expect(screen.getByText(/You Win/i)).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(<GameEndModal isOpen={false} isWinner={true} />);
      expect(screen.queryByText(/You Win/i)).not.toBeInTheDocument();
    });
  });

  describe('Single-round game (victory)', () => {
    it('should show winner title', () => {
      render(<GameEndModal isOpen={true} isWinner={true} />);
      expect(screen.getByText('You Win! 🎉')).toBeInTheDocument();
    });

    it('should show winner trophy', () => {
      render(<GameEndModal isOpen={true} isWinner={true} />);
      expect(screen.getByText('🏆')).toBeInTheDocument();
    });

    it('should show congratulations message', () => {
      render(<GameEndModal isOpen={true} isWinner={true} />);
      expect(screen.getByText(/got rid of all your cards/i)).toBeInTheDocument();
    });

    it('should show celebration note', () => {
      render(<GameEndModal isOpen={true} isWinner={true} />);
      expect(screen.getByText(/Well played/i)).toBeInTheDocument();
    });

    it('should show back to lobby button', () => {
      render(<GameEndModal isOpen={true} isWinner={true} />);
      expect(screen.getByRole('link', { name: /Back to Lobby/i })).toBeInTheDocument();
    });
  });

  describe('Single-round game (loss)', () => {
    it('should show game over title', () => {
      render(<GameEndModal isOpen={true} isWinner={false} />);
      expect(screen.getByText('Game Over')).toBeInTheDocument();
    });

    it('should show sad face', () => {
      render(<GameEndModal isOpen={true} isWinner={false} />);
      expect(screen.getByText('😔')).toBeInTheDocument();
    });

    it('should show better luck message', () => {
      render(<GameEndModal isOpen={true} isWinner={false} />);
      expect(screen.getByText(/Better luck next time/i)).toBeInTheDocument();
    });

    it('should not show celebration note', () => {
      render(<GameEndModal isOpen={true} isWinner={false} />);
      expect(screen.queryByText(/Well played/i)).not.toBeInTheDocument();
    });
  });

  describe('Walkover (single-round)', () => {
    it('should show walkover title when winner', () => {
      render(<GameEndModal isOpen={true} isWinner={true} isWalkover={true} />);
      expect(screen.getByText('Victory by Walkover!')).toBeInTheDocument();
    });

    it('should show walkover message when winner', () => {
      render(<GameEndModal isOpen={true} isWinner={true} isWalkover={true} />);
      expect(screen.getByText(/All other players disconnected/i)).toBeInTheDocument();
    });

    it('should show walkover title when not winner', () => {
      render(<GameEndModal isOpen={true} isWinner={false} isWalkover={true} />);
      expect(screen.getByText('Game Ended')).toBeInTheDocument();
    });

    it('should show appropriate message for non-winner walkover', () => {
      render(<GameEndModal isOpen={true} isWinner={false} isWalkover={true} />);
      expect(screen.getByText(/All players disconnected/i)).toBeInTheDocument();
    });

    it('should show walkover note when winner', () => {
      render(<GameEndModal isOpen={true} isWinner={true} isWalkover={true} />);
      expect(screen.getByText(/Not the most exciting win/i)).toBeInTheDocument();
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
          isMultiRound={true}
          standings={manyPlayerStandings}
        />
      );

      expect(screen.getByText(/1\. Alice/)).toBeInTheDocument();
      expect(screen.getByText(/5\. Eve/)).toBeInTheDocument();
    });
  });

  describe('Multi-round game with walkover', () => {
    const standings = [
      { clientId: 1, name: 'Alice', score: 350 },
      { clientId: 2, name: 'Bob', score: 200 },
    ];

    it('should show final standings with walkover note', () => {
      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          isMultiRound={true}
          isWalkover={true}
          standings={standings}
        />
      );

      expect(screen.getByText('Final Standings')).toBeInTheDocument();
      expect(screen.getByText(/Game ended early due to walkover/i)).toBeInTheDocument();
    });

    it('should show current scores even though game ended early', () => {
      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          isMultiRound={true}
          isWalkover={true}
          standings={standings}
        />
      );

      expect(screen.getByText('350 pts')).toBeInTheDocument();
      expect(screen.getByText('200 pts')).toBeInTheDocument();
    });

    it('should show walkover title', () => {
      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          isMultiRound={true}
          isWalkover={true}
          standings={standings}
        />
      );

      expect(screen.getByText('Victory by Walkover!')).toBeInTheDocument();
    });

    it('should show walkover message', () => {
      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
          isMultiRound={true}
          isWalkover={true}
          standings={standings}
        />
      );

      expect(screen.getByText(/All other players disconnected/i)).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty standings array', () => {
      render(
        <GameEndModal
          isOpen={true}
          isWinner={true}
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
          isMultiRound={true}
          standings={zeroScores}
        />
      );

      expect(screen.getAllByText('0 pts')).toHaveLength(2);
    });
  });
});
