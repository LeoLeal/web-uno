import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { PlayerList } from './PlayerList';
import { JoinGameModal } from '@/components/modals/JoinGameModal';
import { StartGameButton } from './StartGameButton';
import { HostDisconnectModal } from '@/components/modals/HostDisconnectModal';
import { MIN_PLAYERS, MAX_PLAYERS } from '@/lib/game/constants';

// Mock HTMLDialogElement methods for jsdom
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

// Mock routing navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Lobby Components Accessibility', () => {
  describe('PlayerList', () => {
    const mockPlayers = [
      { clientId: 1, name: 'Alice', avatar: '🦊', isHost: true },
      { clientId: 2, name: 'Bob', avatar: '🐻', isHost: false },
      { clientId: 3, name: 'Charlie', avatar: '🐱', isHost: false },
    ];

    it('should have no accessibility violations', async () => {
      const { container } = render(
        <PlayerList players={mockPlayers} myClientId={1} hostId={1} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with empty players', async () => {
      const { container } = render(
        <PlayerList players={[]} myClientId={null} hostId={null} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should display player names visibly', () => {
      render(<PlayerList players={mockPlayers} myClientId={1} hostId={1} />);
      expect(screen.getByText('Alice')).toBeVisible();
      expect(screen.getByText('Bob')).toBeVisible();
      expect(screen.getByText('Charlie')).toBeVisible();
    });

    it('should indicate current player with "You" label', () => {
      render(<PlayerList players={mockPlayers} myClientId={1} hostId={2} />);
      expect(screen.getByText('You')).toBeVisible();
    });

    it('should indicate host status', () => {
      render(<PlayerList players={mockPlayers} myClientId={1} hostId={2} />);
      expect(screen.getByText('(Host)')).toBeVisible();
    });
  });

  describe('JoinGameModal', () => {
    it('should have no accessibility violations when open', async () => {
      const { container } = render(
        <JoinGameModal isOpen={true} onJoin={vi.fn()} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible form labels', () => {
      render(<JoinGameModal isOpen={true} onJoin={vi.fn()} />);
      
      // Input should have aria-label
      const input = screen.getByRole('textbox', { name: /your name/i });
      expect(input).toBeVisible();
    });

    it('should have accessible button', () => {
      render(<JoinGameModal isOpen={true} onJoin={vi.fn()} />);
      
      const button = screen.getByRole('button', { name: /join lobby/i });
      expect(button).toBeVisible();
    });

    it('should focus input on open', () => {
      render(<JoinGameModal isOpen={true} onJoin={vi.fn()} />);
      
      const input = screen.getByRole('textbox', { name: /your name/i });
      expect(input).toHaveFocus();
    });

    it('should submit form on Enter key', async () => {
      const onJoin = vi.fn();
      render(<JoinGameModal isOpen={true} onJoin={onJoin} />);
      
      const input = screen.getByRole('textbox', { name: /your name/i });
      await userEvent.type(input, 'TestUser{enter}');
      
      expect(onJoin).toHaveBeenCalledWith('TestUser');
    });
  });

  describe('StartGameButton', () => {
    it('should have no accessibility violations when host', async () => {
      const { container } = render(
        <StartGameButton isHost={true} playerCount={MIN_PLAYERS} onStart={vi.fn()} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when not host', async () => {
      const { container } = render(
        <StartGameButton isHost={false} playerCount={MIN_PLAYERS} onStart={vi.fn()} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible button when enabled', () => {
      render(<StartGameButton isHost={true} playerCount={MIN_PLAYERS} onStart={vi.fn()} />);
      
      const button = screen.getByRole('button', { name: /start game/i });
      expect(button).toBeEnabled();
    });

    it('should indicate disabled state accessibly when below minimum', () => {
      render(<StartGameButton isHost={true} playerCount={MIN_PLAYERS - 1} onStart={vi.fn()} />);
      
      const button = screen.getByRole('button', { name: /waiting for players/i });
      expect(button).toBeDisabled();
    });

    it('should indicate disabled state accessibly when above maximum', () => {
      render(<StartGameButton isHost={true} playerCount={MAX_PLAYERS + 1} onStart={vi.fn()} />);
      
      const button = screen.getByRole('button', { name: /too many players/i });
      expect(button).toBeDisabled();
    });

    it('should show waiting message for non-hosts', () => {
      render(<StartGameButton isHost={false} playerCount={MIN_PLAYERS} onStart={vi.fn()} />);
      
      expect(screen.getByText(/waiting for host to start/i)).toBeVisible();
    });

    it('should show correct message for minimum players', () => {
      render(<StartGameButton isHost={true} playerCount={MIN_PLAYERS - 1} onStart={vi.fn()} />);
      
      expect(screen.getByText(new RegExp(`waiting for players.*${MIN_PLAYERS - 1}/${MIN_PLAYERS}`, 'i'))).toBeVisible();
    });

    it('should show correct message for maximum exceeded', () => {
      render(<StartGameButton isHost={true} playerCount={MAX_PLAYERS + 1} onStart={vi.fn()} />);
      
      expect(screen.getByText(new RegExp(`too many players.*${MAX_PLAYERS + 1}/${MAX_PLAYERS}`, 'i'))).toBeVisible();
    });
  });

  describe('HostDisconnectModal', () => {
    it('should have no accessibility violations when open', async () => {
      const { container } = render(<HostDisconnectModal />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should display disconnect message clearly', () => {
      render(<HostDisconnectModal />);
      
      expect(screen.getByText(/host disconnected/i)).toBeVisible();
      expect(screen.getByText(/game cannot continue/i)).toBeVisible();
    });

    it('should show countdown accessibly', () => {
      render(<HostDisconnectModal />);
      
      expect(screen.getByText(/returning to home in/i)).toBeVisible();
    });
  });

  describe('Keyboard Navigation', () => {
    it('StartGameButton can be activated via keyboard', async () => {
      const onStart = vi.fn();
      render(<StartGameButton isHost={true} playerCount={MIN_PLAYERS} onStart={onStart} />);
      
      const button = screen.getByRole('button', { name: /start game/i });
      button.focus();
      await userEvent.keyboard('{Enter}');
      
      expect(onStart).toHaveBeenCalled();
    });

});
});
