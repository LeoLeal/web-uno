import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { PlayerList } from './PlayerList';
import { JoinGameModal } from './JoinGameModal';
import { StartGameButton } from './StartGameButton';
import { HostDisconnectModal } from './HostDisconnectModal';
import { GameSettingsPanel } from './GameSettingsPanel';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

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
      
      // Input should have placeholder as accessible name
      const input = screen.getByPlaceholderText(/your name/i);
      expect(input).toBeVisible();
    });

    it('should have accessible button', () => {
      render(<JoinGameModal isOpen={true} onJoin={vi.fn()} />);
      
      const button = screen.getByRole('button', { name: /join lobby/i });
      expect(button).toBeVisible();
    });

    it('should focus input on open', () => {
      render(<JoinGameModal isOpen={true} onJoin={vi.fn()} />);
      
      const input = screen.getByPlaceholderText(/your name/i);
      expect(input).toHaveFocus();
    });

    it('should submit form on Enter key', async () => {
      const onJoin = vi.fn();
      render(<JoinGameModal isOpen={true} onJoin={onJoin} />);
      
      const input = screen.getByPlaceholderText(/your name/i);
      await userEvent.type(input, 'TestUser{enter}');
      
      expect(onJoin).toHaveBeenCalledWith('TestUser');
    });
  });

  describe('StartGameButton', () => {
    it('should have no accessibility violations when host', async () => {
      const { container } = render(
        <StartGameButton isHost={true} playerCount={3} onStart={vi.fn()} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when not host', async () => {
      const { container } = render(
        <StartGameButton isHost={false} playerCount={3} onStart={vi.fn()} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible button when enabled', () => {
      render(<StartGameButton isHost={true} playerCount={3} onStart={vi.fn()} />);
      
      const button = screen.getByRole('button', { name: /start game/i });
      expect(button).toBeEnabled();
    });

    it('should indicate disabled state accessibly', () => {
      render(<StartGameButton isHost={true} playerCount={2} onStart={vi.fn()} />);
      
      const button = screen.getByRole('button', { name: /waiting for players/i });
      expect(button).toBeDisabled();
    });

    it('should show waiting message for non-hosts', () => {
      render(<StartGameButton isHost={false} playerCount={3} onStart={vi.fn()} />);
      
      expect(screen.getByText(/waiting for host to start/i)).toBeVisible();
    });
  });

  describe('HostDisconnectModal', () => {
    it('should have no accessibility violations when open', async () => {
      const { container } = render(<HostDisconnectModal isOpen={true} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should display disconnect message clearly', () => {
      render(<HostDisconnectModal isOpen={true} />);
      
      expect(screen.getByText(/host disconnected/i)).toBeVisible();
      expect(screen.getByText(/game cannot continue/i)).toBeVisible();
    });

    it('should show countdown accessibly', () => {
      render(<HostDisconnectModal isOpen={true} />);
      
      expect(screen.getByText(/returning to home in/i)).toBeVisible();
    });
  });

  describe('GameSettingsPanel', () => {
    it('should have no accessibility violations for host', async () => {
      const { container } = render(<GameSettingsPanel isHost={true} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for non-host', async () => {
      const { container } = render(<GameSettingsPanel isHost={false} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should display settings summary', () => {
      render(<GameSettingsPanel isHost={false} />);
      
      expect(screen.getByText(/game settings/i)).toBeVisible();
      expect(screen.getByText(/standard rules/i)).toBeVisible();
    });

    it('should show Configure button only for host', () => {
      const { rerender } = render(<GameSettingsPanel isHost={true} />);
      expect(screen.getByRole('button', { name: /configure/i })).toBeVisible();
      
      rerender(<GameSettingsPanel isHost={false} />);
      expect(screen.queryByRole('button', { name: /configure/i })).not.toBeInTheDocument();
    });

    it('should have accessible Configure button', () => {
      render(<GameSettingsPanel isHost={true} />);
      
      const button = screen.getByRole('button', { name: /configure/i });
      expect(button).toBeEnabled();
    });
  });

  describe('Color Contrast', () => {
    it('PlayerList should have sufficient color contrast', async () => {
      const mockPlayers = [{ clientId: 1, name: 'Alice', avatar: '🦊', isHost: true }];
      const { container } = render(
        <PlayerList players={mockPlayers} myClientId={1} hostId={1} />
      );
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('JoinGameModal should have sufficient color contrast', async () => {
      const { container } = render(
        <JoinGameModal isOpen={true} onJoin={vi.fn()} />
      );
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('GameSettingsPanel should have sufficient color contrast', async () => {
      const { container } = render(<GameSettingsPanel isHost={true} />);
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('JoinGameModal form can be submitted via keyboard', async () => {
      const onJoin = vi.fn();
      render(<JoinGameModal isOpen={true} onJoin={onJoin} />);
      
      // Type name and press Enter
      await userEvent.keyboard('TestPlayer{Enter}');
      
      expect(onJoin).toHaveBeenCalledWith('TestPlayer');
    });

    it('StartGameButton can be activated via keyboard', async () => {
      const onStart = vi.fn();
      render(<StartGameButton isHost={true} playerCount={3} onStart={onStart} />);
      
      const button = screen.getByRole('button', { name: /start game/i });
      button.focus();
      await userEvent.keyboard('{Enter}');
      
      expect(onStart).toHaveBeenCalled();
    });

    it('GameSettingsPanel Configure button can be activated via keyboard', async () => {
      render(<GameSettingsPanel isHost={true} />);
      
      const button = screen.getByRole('button', { name: /configure/i });
      button.focus();
      await userEvent.keyboard('{Enter}');
      
      // Toast should appear
      expect(await screen.findByText(/coming soon/i)).toBeVisible();
    });
  });
});
