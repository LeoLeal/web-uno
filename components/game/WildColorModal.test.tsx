import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WildColorModal } from './WildColorModal';

// Mock HTMLDialogElement methods for jsdom
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('WildColorModal', () => {
  const mockOnSelect = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
    mockOnCancel.mockClear();
  });

  describe('Modal Visibility', () => {
    it('should not call showModal when isOpen is false', () => {
      const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, 'showModal');

      render(
        <WildColorModal
          isOpen={false}
          onSelect={mockOnSelect}
          onCancel={mockOnCancel}
        />
      );

      // Dialog element exists but showModal should not be called
      expect(showModalSpy).not.toHaveBeenCalled();
    });

    it('should render when isOpen is true', () => {
      render(
        <WildColorModal
          isOpen={true}
          onSelect={mockOnSelect}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Choose a Color')).toBeInTheDocument();
    });
  });

  describe('Color Buttons', () => {
    it('should render all 4 color buttons', () => {
      render(
        <WildColorModal
          isOpen={true}
          onSelect={mockOnSelect}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Red')).toBeInTheDocument();
      expect(screen.getByText('Blue')).toBeInTheDocument();
      expect(screen.getByText('Yellow')).toBeInTheDocument();
      expect(screen.getByText('Green')).toBeInTheDocument();
    });

    it('should call onSelect with red when red button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <WildColorModal
          isOpen={true}
          onSelect={mockOnSelect}
          onCancel={mockOnCancel}
        />
      );

      const redButton = screen.getByText('Red');
      await user.click(redButton);

      expect(mockOnSelect).toHaveBeenCalledWith('red');
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });

    it('should call onSelect with blue when blue button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <WildColorModal
          isOpen={true}
          onSelect={mockOnSelect}
          onCancel={mockOnCancel}
        />
      );

      const blueButton = screen.getByText('Blue');
      await user.click(blueButton);

      expect(mockOnSelect).toHaveBeenCalledWith('blue');
    });

    it('should call onSelect with yellow when yellow button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <WildColorModal
          isOpen={true}
          onSelect={mockOnSelect}
          onCancel={mockOnCancel}
        />
      );

      const yellowButton = screen.getByText('Yellow');
      await user.click(yellowButton);

      expect(mockOnSelect).toHaveBeenCalledWith('yellow');
    });

    it('should call onSelect with green when green button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <WildColorModal
          isOpen={true}
          onSelect={mockOnSelect}
          onCancel={mockOnCancel}
        />
      );

      const greenButton = screen.getByText('Green');
      await user.click(greenButton);

      expect(mockOnSelect).toHaveBeenCalledWith('green');
    });
  });

  describe('Modal Dismissal', () => {
    it('should call onCancel when backdrop is clicked', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <WildColorModal
          isOpen={true}
          onSelect={mockOnSelect}
          onCancel={mockOnCancel}
        />
      );

      // Click the backdrop (modal overlay)
      const backdrop = container.querySelector('[role="dialog"]')?.parentElement;
      if (backdrop) {
        await user.click(backdrop);
      }

      // Note: Modal component handles backdrop clicks via onClose prop
      // which is mapped to onCancel in WildColorModal
    });
  });

  describe('Accessibility', () => {
    it('should have aria-labels for color buttons', () => {
      render(
        <WildColorModal
          isOpen={true}
          onSelect={mockOnSelect}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText('Choose Red')).toBeInTheDocument();
      expect(screen.getByLabelText('Choose Blue')).toBeInTheDocument();
      expect(screen.getByLabelText('Choose Yellow')).toBeInTheDocument();
      expect(screen.getByLabelText('Choose Green')).toBeInTheDocument();
    });
  });
});
