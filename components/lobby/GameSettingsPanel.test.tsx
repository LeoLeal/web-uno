import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { GameSettingsPanel } from './GameSettingsPanel';
import { DEFAULT_SETTINGS } from '@/lib/game/settings';

// Mock HTMLDialogElement methods for jsdom
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

// Mock the hooks
const mockUpdateSettings = vi.fn();
let mockSettings = DEFAULT_SETTINGS;
let mockStatus = 'LOBBY';

vi.mock('@/hooks/useGameSettings', () => ({
  useGameSettings: () => ({
    settings: mockSettings,
    updateSettings: mockUpdateSettings,
    initSettings: vi.fn(),
  }),
}));

vi.mock('@/hooks/useGameState', () => ({
  useGameState: () => ({
    status: mockStatus,
    startGame: vi.fn(),
    initGame: vi.fn(),
  }),
}));

describe('GameSettingsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSettings = DEFAULT_SETTINGS;
    mockStatus = 'LOBBY';
  });

  describe('rendering', () => {
    it('should render settings panel', () => {
      render(<GameSettingsPanel isHost={false} />);

      expect(screen.getByRole('heading', { name: 'Game Settings', level: 3 })).toBeInTheDocument();
    });

    it('should display settings icon', () => {
      render(<GameSettingsPanel isHost={false} />);

      const icon = document.querySelector('.lucide-settings');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('summary text', () => {
    it('should show "Standard rules" when all defaults', () => {
      render(<GameSettingsPanel isHost={false} />);

      expect(screen.getByText(/No stacking/)).toBeInTheDocument();
      expect(screen.getByText(/7 cards/)).toBeInTheDocument();
    });

    it('should show active rules when non-default', () => {
      mockSettings = {
        ...DEFAULT_SETTINGS,
        drawStacking: true,
        jumpIn: true,
      };

      render(<GameSettingsPanel isHost={false} />);

      expect(screen.getByText(/Stacking · Jump-In/)).toBeInTheDocument();
    });

    it('should show rule count when many rules enabled', () => {
      mockSettings = {
        ...DEFAULT_SETTINGS,
        drawStacking: true,
        jumpIn: true,
        zeroSwap: true,
        sevenSwap: true,
      };

      render(<GameSettingsPanel isHost={false} />);

      expect(screen.getByText(/Stacking · Jump-In · 0-Swap · 7-Swap/)).toBeInTheDocument();
    });

    it('should show hand size in summary', () => {
      mockSettings = {
        ...DEFAULT_SETTINGS,
        startingHandSize: 5,
      };

      render(<GameSettingsPanel isHost={false} />);

      expect(screen.getByText(/5 cards/)).toBeInTheDocument();
    });

    it('should show score limit when not null', () => {
      mockSettings = {
        ...DEFAULT_SETTINGS,
        scoreLimit: 500,
      };

      render(<GameSettingsPanel isHost={false} />);

      expect(screen.getByText(/500 pts/)).toBeInTheDocument();
    });
  });

  describe('configure button', () => {
    it('should show Configure button for host in LOBBY', () => {
      render(<GameSettingsPanel isHost={true} />);

      expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument();
    });

    it('should not show Configure button for non-host', () => {
      render(<GameSettingsPanel isHost={false} />);

      expect(screen.queryByRole('button', { name: 'Configure' })).not.toBeInTheDocument();
    });

    it('should not show Configure button when PLAYING', () => {
      mockStatus = 'PLAYING';
      render(<GameSettingsPanel isHost={true} />);

      expect(screen.queryByRole('button', { name: 'Configure' })).not.toBeInTheDocument();
    });

    it('should not show Configure button when ENDED', () => {
      mockStatus = 'ENDED';
      render(<GameSettingsPanel isHost={true} />);

      expect(screen.queryByRole('button', { name: 'Configure' })).not.toBeInTheDocument();
    });
  });

  describe('modal interaction', () => {
    it('should open modal when clicking Configure', () => {
      render(<GameSettingsPanel isHost={true} />);

      fireEvent.click(screen.getByRole('button', { name: 'Configure' }));

      // Modal should be open (dialog has open attribute)
      const dialog = document.querySelector('dialog');
      expect(dialog).toHaveAttribute('open');
      expect(screen.getByText('Deal')).toBeInTheDocument();
    });

    it('should call updateSettings when saving from modal', () => {
      render(<GameSettingsPanel isHost={true} />);

      // Open modal
      fireEvent.click(screen.getByRole('button', { name: 'Configure' }));

      // Make a change
      fireEvent.click(screen.getByRole('radio', { name: '10' }));

      // Save
      fireEvent.click(screen.getByText('Save Settings'));

      expect(mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          startingHandSize: 10,
        })
      );
    });
  });
});
