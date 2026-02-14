import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OpponentIndicator } from './OpponentIndicator';

describe('OpponentIndicator', () => {
  const defaultProps = {
    clientId: 1,
    name: 'Alice',
    avatar: '🐱',
    cardCount: 5,
    isCurrentTurn: false,
  };

  describe('Basic Rendering', () => {
    it('should render opponent name', () => {
      render(<OpponentIndicator {...defaultProps} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('should render avatar', () => {
      render(<OpponentIndicator {...defaultProps} />);
      expect(screen.getByText('🐱')).toBeInTheDocument();
    });

    it('should show crown for host', () => {
      render(<OpponentIndicator {...defaultProps} isHost={true} />);
      expect(screen.getByText('👑')).toBeInTheDocument();
    });
  });

  describe('Disconnection Indicator', () => {
    it('should show disconnect icon when player is disconnected', () => {
      render(<OpponentIndicator {...defaultProps} isDisconnected={true} />);
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('should not show disconnect icon for connected players', () => {
      render(<OpponentIndicator {...defaultProps} isDisconnected={false} />);
      expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
    });

    it('should apply dimmed styling when disconnected', () => {
      const { container } = render(
        <OpponentIndicator {...defaultProps} isDisconnected={true} />
      );

      const avatar = container.querySelector('.opacity-40');
      expect(avatar).toBeInTheDocument();
    });

    it('should apply grayscale filter when disconnected', () => {
      const { container } = render(
        <OpponentIndicator {...defaultProps} isDisconnected={true} />
      );

      const avatar = container.querySelector('.grayscale');
      expect(avatar).toBeInTheDocument();
    });

    it('should not apply dimmed styling when connected', () => {
      const { container } = render(
        <OpponentIndicator {...defaultProps} isDisconnected={false} />
      );

      // The avatar div should not have opacity-40 or grayscale
      const avatarDiv = container.querySelector('.w-16');
      expect(avatarDiv).not.toHaveClass('opacity-40');
      expect(avatarDiv).not.toHaveClass('grayscale');
    });
  });

  describe('Turn Indicator', () => {
    it('should highlight when current turn', () => {
      const { container } = render(
        <OpponentIndicator {...defaultProps} isCurrentTurn={true} />
      );

      const avatar = container.querySelector('.border-yellow-400');
      expect(avatar).toBeInTheDocument();
    });

    it('should show disconnected and current turn together', () => {
      const { container } = render(
        <OpponentIndicator
          {...defaultProps}
          isCurrentTurn={true}
          isDisconnected={true}
        />
      );

      // Should have both turn highlight and disconnect styling
      expect(container.querySelector('.border-yellow-400')).toBeInTheDocument();
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });
  });

  describe('Card Count Display', () => {
    it('should show individual cards for small counts', () => {
      const { container } = render(
        <OpponentIndicator {...defaultProps} cardCount={3} />
      );

      // Should render 3 small cards (CardCountFan renders cards with 16px width)
      const cards = container.querySelectorAll('[style*="width: 16"]');
      expect(cards.length).toBe(3);
    });

    it('should show all cards in fan for large hands', () => {
      const { container } = render(
        <OpponentIndicator {...defaultProps} cardCount={10} />
      );
      // CardCountFan now shows ALL cards in a tight fan
      const cards = container.querySelectorAll('[style*="width: 16"]');
      expect(cards.length).toBe(10);
    });
  });

  describe('Host Indicator', () => {
    it('should show crown for host', () => {
      render(<OpponentIndicator {...defaultProps} isHost={true} />);
      expect(screen.getByText('👑')).toBeInTheDocument();
    });

    it('should not show crown for non-host', () => {
      render(<OpponentIndicator {...defaultProps} isHost={false} />);
      expect(screen.queryByText('👑')).not.toBeInTheDocument();
    });

    it('should show disconnected host with crown', () => {
      render(
        <OpponentIndicator
          {...defaultProps}
          isHost={true}
          isDisconnected={true}
        />
      );

      expect(screen.getByText('👑')).toBeInTheDocument();
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });
  });

  describe('UNO Balloon', () => {
    it('should show UNO balloon when player has 1 card', () => {
      render(
        <OpponentIndicator
          {...defaultProps}
          cardCount={1}
        />
      );

      expect(screen.getByText('UNO!')).toBeInTheDocument();
    });

    it('should not show UNO balloon when player has 0 cards', () => {
      render(
        <OpponentIndicator
          {...defaultProps}
          cardCount={0}
        />
      );

      expect(screen.queryByText('UNO!')).not.toBeInTheDocument();
    });

    it('should not show UNO balloon when player has 2 cards', () => {
      render(
        <OpponentIndicator
          {...defaultProps}
          cardCount={2}
        />
      );

      expect(screen.queryByText('UNO!')).not.toBeInTheDocument();
    });

    it('should not show UNO balloon when player has many cards', () => {
      render(
        <OpponentIndicator
          {...defaultProps}
          cardCount={7}
        />
      );

      expect(screen.queryByText('UNO!')).not.toBeInTheDocument();
    });

    it('should show UNO balloon even when player is disconnected', () => {
      render(
        <OpponentIndicator
          {...defaultProps}
          cardCount={1}
          isDisconnected={true}
        />
      );

      expect(screen.getByText('UNO!')).toBeInTheDocument();
    });
  });
});
