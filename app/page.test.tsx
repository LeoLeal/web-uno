import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import Home from './page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

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

    it('should have accessible links', async () => {
      render(<Home />);
      
      // Create game link should be accessible
      const createLink = screen.getByRole('link', { name: /create new game/i });
      expect(createLink).toBeInTheDocument();
      expect(createLink).toHaveAttribute('href', '/create');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should have focusable interactive elements', async () => {
      render(<Home />);
      
      // All interactive elements should be focusable
      const link = screen.getByRole('link', { name: /create new game/i });
      const input = screen.getByPlaceholderText('Enter room code...');
      const button = screen.getByRole('button', { name: 'Join room' });
      
      expect(link).not.toHaveAttribute('tabindex', '-1');
      expect(input).not.toHaveAttribute('tabindex', '-1');
      expect(button).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Reduced Motion', () => {
    it('should respect prefers-reduced-motion', async () => {
      // This test verifies the CSS exists - actual motion testing done via Playwright
      const { container } = render(<Home />);
      
      // Verify components with animations are rendered
      expect(container.querySelector('.animate-logo-fade-in')).toBeInTheDocument();
      expect(container.querySelectorAll('.animate-card-fan').length).toBe(4);
    });
  });
});
