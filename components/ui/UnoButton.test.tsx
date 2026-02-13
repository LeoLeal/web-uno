'use client';

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UnoButton } from './UnoButton';

describe('UnoButton', () => {
  describe('when disabled', () => {
    it('renders disabled state', () => {
      render(<UnoButton isEnabled={false} onClick={() => {}} />);
      
      const button = screen.getByRole('button', { name: /cannot call uno/i });
      expect(button).toBeDisabled();
    });

    it('does not call onClick when disabled', () => {
      const mockOnClick = vi.fn();
      render(<UnoButton isEnabled={false} onClick={mockOnClick} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('when enabled', () => {
    it('renders enabled state', () => {
      render(<UnoButton isEnabled={true} onClick={() => {}} />);
      
      const button = screen.getByRole('button', { name: /call uno/i });
      expect(button).toBeEnabled();
    });

    it('calls onClick when clicked', () => {
      const mockOnClick = vi.fn();
      render(<UnoButton isEnabled={true} onClick={mockOnClick} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('when UNO already called', () => {
    it('renders as disabled', () => {
      render(<UnoButton isEnabled={true} onClick={() => {}} hasCalledUno={true} />);
      
      const button = screen.getByRole('button', { name: /uno called/i });
      expect(button).toBeDisabled();
    });

    it('does not call onClick when already called', () => {
      const mockOnClick = vi.fn();
      render(<UnoButton isEnabled={true} onClick={mockOnClick} hasCalledUno={true} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  it('renders UNO text', () => {
    render(<UnoButton isEnabled={true} onClick={() => {}} />);
    
    expect(screen.getByText('UNO')).toBeInTheDocument();
  });

  it('renders UNO! text when already called', () => {
    render(<UnoButton isEnabled={true} onClick={() => {}} hasCalledUno={true} />);
    
    expect(screen.getByText('UNO!')).toBeInTheDocument();
  });
});
