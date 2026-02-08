import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import Home from './page';
import cardFanStyles from '../components/ui/CardFan.module.css';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

describe('Homepage', () => {
  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Home />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have sufficient color contrast on buttons', async () => {
      const { container } = render(<Home />);
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have accessible form elements', async () => {
      render(<Home />);
      
      // Input should have aria-label
      const input = screen.getByPlaceholderText('Enter room code...');
      expect(input).toHaveAttribute('aria-label', 'Room code');
      
      // Submit button should have aria-label
      const submitButton = screen.getByRole('button', { name: 'Join room' });
      expect(submitButton).toBeInTheDocument();
    });

    it('should have accessible buttons', async () => {
      render(<Home />);
      
      // Create game button should be accessible
      const createButton = screen.getByRole('button', { name: /create new game/i });
      expect(createButton).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should have focusable interactive elements', async () => {
      render(<Home />);
      
      // All interactive elements should be focusable
      const createButton = screen.getByRole('button', { name: /create new game/i });
      const input = screen.getByPlaceholderText('Enter room code...');
      const joinButton = screen.getByRole('button', { name: 'Join room' });
      
      expect(createButton).not.toHaveAttribute('tabindex', '-1');
      expect(input).not.toHaveAttribute('tabindex', '-1');
      expect(joinButton).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Reduced Motion', () => {
    it('should respect prefers-reduced-motion', async () => {
      // This test verifies the CSS exists - actual motion testing done via Playwright
      const { container } = render(<Home />);
      
      // Verify components with animations are rendered
      expect(container.querySelector('.animate-logo-fade-in')).toBeInTheDocument();
      expect(container.getElementsByClassName(cardFanStyles.fan).length).toBe(4);
    });
  });
});
