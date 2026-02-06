import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { GameSettingsModal } from './GameSettingsModal';
import { DEFAULT_SETTINGS, GameSettings } from '@/lib/game/settings';

// Mock HTMLDialogElement methods for jsdom
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

describe('GameSettingsModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    currentSettings: DEFAULT_SETTINGS,
    onSave: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render modal with title', () => {
      render(<GameSettingsModal {...defaultProps} />);

      expect(screen.getByText('Game Settings')).toBeInTheDocument();
    });

    it('should render Deal section', () => {
      render(<GameSettingsModal {...defaultProps} />);

      expect(screen.getByText('Deal')).toBeInTheDocument();
      expect(screen.getByText('Starting Hand Size')).toBeInTheDocument();
      expect(screen.getByText('Score Limit')).toBeInTheDocument();
    });

    it('should render House Rules section', () => {
      render(<GameSettingsModal {...defaultProps} />);

      expect(screen.getByText('House Rules')).toBeInTheDocument();
      expect(screen.getByText('Draw Stacking')).toBeInTheDocument();
      expect(screen.getByText('Jump-In')).toBeInTheDocument();
      expect(screen.getByText('Zero Swap')).toBeInTheDocument();
      expect(screen.getByText('Seven Swap')).toBeInTheDocument();
      expect(screen.getByText('Force Play')).toBeInTheDocument();
      expect(screen.getByText('Multiple Card Play')).toBeInTheDocument();
    });

    it('should render hand size options', () => {
      render(<GameSettingsModal {...defaultProps} />);

      expect(screen.getByRole('radio', { name: '5' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '7' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '10' })).toBeInTheDocument();
    });

    it('should render score limit options including infinity', () => {
      render(<GameSettingsModal {...defaultProps} />);

      expect(screen.getByRole('radio', { name: '100' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '200' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '300' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '500' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '∞' })).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<GameSettingsModal {...defaultProps} />);

      expect(screen.getByText('Reset to Defaults')).toBeInTheDocument();
      expect(screen.getByText('Save Settings')).toBeInTheDocument();
    });
  });

  describe('current values', () => {
    it('should show current hand size as selected', () => {
      render(<GameSettingsModal {...defaultProps} />);

      expect(screen.getByRole('radio', { name: '7' })).toHaveAttribute('aria-checked', 'true');
    });

    it('should show current score limit as selected', () => {
      render(<GameSettingsModal {...defaultProps} />);

      // Default is null (∞)
      expect(screen.getByRole('radio', { name: '∞' })).toHaveAttribute('aria-checked', 'true');
    });

    it('should reflect non-default settings', () => {
      const customSettings: GameSettings = {
        ...DEFAULT_SETTINGS,
        startingHandSize: 10,
        scoreLimit: 500,
        drawStacking: true,
      };

      render(<GameSettingsModal {...defaultProps} currentSettings={customSettings} />);

      expect(screen.getByRole('radio', { name: '10' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('radio', { name: '500' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('switch', { name: 'Draw Stacking' })).toHaveAttribute(
        'aria-checked',
        'true'
      );
    });
  });

  describe('editing settings', () => {
    it('should update hand size when clicking option', () => {
      render(<GameSettingsModal {...defaultProps} />);

      fireEvent.click(screen.getByRole('radio', { name: '5' }));

      expect(screen.getByRole('radio', { name: '5' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('radio', { name: '7' })).toHaveAttribute('aria-checked', 'false');
    });

    it('should update score limit when clicking option', () => {
      render(<GameSettingsModal {...defaultProps} />);

      fireEvent.click(screen.getByRole('radio', { name: '200' }));

      expect(screen.getByRole('radio', { name: '200' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('radio', { name: '∞' })).toHaveAttribute('aria-checked', 'false');
    });

    it('should toggle boolean setting when clicking switch', () => {
      render(<GameSettingsModal {...defaultProps} />);

      const toggle = screen.getByRole('switch', { name: 'Draw Stacking' });
      expect(toggle).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('save', () => {
    it('should call onSave with current draft when clicking Save', () => {
      const onSave = vi.fn();
      render(<GameSettingsModal {...defaultProps} onSave={onSave} />);

      // Make some changes
      fireEvent.click(screen.getByRole('radio', { name: '10' }));
      fireEvent.click(screen.getByRole('switch', { name: 'Jump-In' }));

      // Save
      fireEvent.click(screen.getByText('Save Settings'));

      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          startingHandSize: 10,
          jumpIn: true,
        })
      );
    });

    it('should call onClose after saving', () => {
      const onClose = vi.fn();
      render(<GameSettingsModal {...defaultProps} onClose={onClose} />);

      fireEvent.click(screen.getByText('Save Settings'));

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset all settings to defaults when clicking Reset', () => {
      const customSettings: GameSettings = {
        startingHandSize: 10,
        scoreLimit: 500,
        drawStacking: true,
        jumpIn: true,
        zeroSwap: true,
        sevenSwap: true,
        forcePlay: true,
        multipleCardPlay: true,
      };

      render(<GameSettingsModal {...defaultProps} currentSettings={customSettings} />);

      // Verify non-default values
      expect(screen.getByRole('radio', { name: '10' })).toHaveAttribute('aria-checked', 'true');

      // Reset
      fireEvent.click(screen.getByText('Reset to Defaults'));

      // Verify defaults
      expect(screen.getByRole('radio', { name: '7' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('radio', { name: '∞' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('switch', { name: 'Draw Stacking' })).toHaveAttribute(
        'aria-checked',
        'false'
      );
    });
  });

  describe('close', () => {
    it('should call onClose when clicking X button', () => {
      const onClose = vi.fn();
      render(<GameSettingsModal {...defaultProps} onClose={onClose} />);

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have aria-labelledby on modal', () => {
      render(<GameSettingsModal {...defaultProps} />);

      const dialog = document.querySelector('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'settings-modal-title');
    });

    it('should render info tooltips for all settings', () => {
      render(<GameSettingsModal {...defaultProps} />);

      // Should have 8 tooltips (2 for discrete + 6 for boolean)
      const tooltips = document.querySelectorAll('.info-tooltip');
      expect(tooltips.length).toBe(8);
    });
  });
});
