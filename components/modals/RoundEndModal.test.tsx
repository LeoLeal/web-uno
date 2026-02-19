import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoundEndModal } from './RoundEndModal';
import userEvent from '@testing-library/user-event';

describe('RoundEndModal', () => {
  const defaultStandings = [
    { clientId: 2, name: 'Bob', score: 200 },
    { clientId: 1, name: 'Alice', score: 150 },
    { clientId: 3, name: 'Charlie', score: 75 },
  ];

  const defaultProps = {
    isOpen: true,
    winnerName: 'Bob',
    roundPoints: 50,
    standings: defaultStandings,
    scoreLimit: 500,
    isHost: false,
    onNextRound: vi.fn(),
  };

  describe('Basic Rendering', () => {
    it('should render when open', () => {
      render(<RoundEndModal {...defaultProps} />);
      expect(screen.getByText(/Round Complete/i)).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(<RoundEndModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText(/Round Complete/i)).not.toBeInTheDocument();
    });

    it('should display winner name in round result section', () => {
      render(<RoundEndModal {...defaultProps} />);
      // Winner name appears in the result paragraph, not in standings
      const resultText = screen.getByText((_content, element) => {
        return element?.textContent === 'Bob wins this round and gains 50 points!';
      });
      expect(resultText).toBeInTheDocument();
    });

    it('should display score limit', () => {
      render(<RoundEndModal {...defaultProps} />);
      expect(screen.getByText(/500 points/i)).toBeInTheDocument();
    });
  });

  describe('Current Standings', () => {
    it('should display all players in standings', () => {
      render(<RoundEndModal {...defaultProps} />);
      // Find standings section and check its contents
      const standingsSection = screen.getByText(/Standings/).closest('div');
      expect(standingsSection).toHaveTextContent('Alice');
      expect(standingsSection).toHaveTextContent('Bob');
      expect(standingsSection).toHaveTextContent('Charlie');
    });

    it('should display scores for all players in standings', () => {
      render(<RoundEndModal {...defaultProps} />);
      const standingsSection = screen.getByText(/Standings/).closest('div');
      expect(standingsSection).toHaveTextContent('150 pts');
      expect(standingsSection).toHaveTextContent('200 pts');
      expect(standingsSection).toHaveTextContent('75 pts');
    });

    it('should display players in provided order (sorted by score)', () => {
      render(<RoundEndModal {...defaultProps} />);

      // Get all standings entries - find by exact text pattern in standings
      const standingsSection = screen.getByText(/Standings/).closest('div');
      const standingsText = standingsSection?.textContent || '';
      
      // Check that Bob comes first (highest score), then Alice, then Charlie
      const bobIndex = standingsText.indexOf('Bob');
      const aliceIndex = standingsText.indexOf('Alice');
      const charlieIndex = standingsText.indexOf('Charlie');
      
      expect(bobIndex).toBeLessThan(aliceIndex);
      expect(aliceIndex).toBeLessThan(charlieIndex);
    });

    it('should handle players with same score', () => {
      const tiedStandings = [
        { clientId: 1, name: 'Alice', score: 150 },
        { clientId: 2, name: 'Bob', score: 150 },
        { clientId: 3, name: 'Charlie', score: 75 },
      ];

      render(<RoundEndModal {...defaultProps} standings={tiedStandings} />);

      const standingsSection = screen.getByText(/Standings/).closest('div');
      expect(standingsSection).toHaveTextContent('Alice');
      expect(standingsSection).toHaveTextContent('Bob');
      // Should show 150 pts twice in standings (not in round result)
      expect(standingsSection?.textContent?.match(/150 pts/g)).toHaveLength(2);
    });
  });

  describe('Host Controls', () => {
    it('should show "Next Round" button for host', () => {
      render(<RoundEndModal {...defaultProps} isHost={true} />);
      expect(screen.getByRole('button', { name: /Next Round/i })).toBeInTheDocument();
    });

    it('should call onNextRound when host clicks button', async () => {
      const user = userEvent.setup();
      const onNextRound = vi.fn();

      render(
        <RoundEndModal {...defaultProps} isHost={true} onNextRound={onNextRound} />
      );

      const button = screen.getByRole('button', { name: /Next Round/i });
      await user.click(button);

      expect(onNextRound).toHaveBeenCalledTimes(1);
    });

    it('should show "Waiting for host..." message for non-host', () => {
      render(<RoundEndModal {...defaultProps} isHost={false} />);
      expect(screen.getByText(/Waiting for host/i)).toBeInTheDocument();
    });

    it('should not show "Next Round" button for non-host', () => {
      render(<RoundEndModal {...defaultProps} isHost={false} />);
      expect(screen.queryByRole('button', { name: /Next Round/i })).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle winner with 0 points gained', () => {
      render(<RoundEndModal {...defaultProps} roundPoints={0} />);
      const resultText = screen.getByText((_content, element) => {
        return element?.textContent === 'Bob wins this round and gains 0 points!';
      });
      expect(resultText).toBeInTheDocument();
    });

    it('should handle large point values', () => {
      const largeScores = [
        { clientId: 2, name: 'Bob', score: 2000 },
        { clientId: 1, name: 'Alice', score: 1500 },
        { clientId: 3, name: 'Charlie', score: 750 },
      ];

      render(<RoundEndModal {...defaultProps} standings={largeScores} />);
      const standingsSection = screen.getByText(/Standings/).closest('div');
      expect(standingsSection).toHaveTextContent('1500 pts');
      expect(standingsSection).toHaveTextContent('2000 pts');
    });

    it('should handle 2-player game', () => {
      const twoPlayerStandings = [
        { clientId: 2, name: 'Bob', score: 150 },
        { clientId: 1, name: 'Alice', score: 100 },
      ];

      render(
        <RoundEndModal
          {...defaultProps}
          standings={twoPlayerStandings}
        />
      );

      const standingsSection = screen.getByText(/Standings/).closest('div');
      expect(standingsSection).toHaveTextContent('Alice');
      expect(standingsSection).toHaveTextContent('Bob');
    });

    it('should handle 4+ player game', () => {
      const manyPlayers = [
        { clientId: 2, name: 'Bob', score: 200 },
        { clientId: 5, name: 'Eve', score: 175 },
        { clientId: 3, name: 'Charlie', score: 150 },
        { clientId: 1, name: 'Alice', score: 100 },
        { clientId: 4, name: 'David', score: 50 },
      ];

      render(
        <RoundEndModal
          {...defaultProps}
          standings={manyPlayers}
        />
      );

      const standingsSection = screen.getByText(/Standings/).closest('div');
      expect(standingsSection).toHaveTextContent('Alice');
      expect(standingsSection).toHaveTextContent('David');
      expect(standingsSection).toHaveTextContent('Eve');
    });

    it('should show different winner names correctly', () => {
      render(<RoundEndModal {...defaultProps} winnerName="Alice" />);
      const resultText = screen.getByText((_content, element) => {
        return element?.textContent === 'Alice wins this round and gains 50 points!';
      });
      expect(resultText).toBeInTheDocument();
    });

    it('should show large round points correctly', () => {
      render(<RoundEndModal {...defaultProps} roundPoints={250} />);
      const resultText = screen.getByText((_content, element) => {
        return element?.textContent === 'Bob wins this round and gains 250 points!';
      });
      expect(resultText).toBeInTheDocument();
    });
  });
});
