import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { InfoTooltip } from './InfoTooltip';
import styles from './InfoTooltip.module.css';

describe('InfoTooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('should render an info icon button', () => {
      render(<InfoTooltip content="Test content" />);

      const trigger = screen.getByRole('button');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveClass(styles.trigger);
    });

    it('should have default aria-label', () => {
      render(<InfoTooltip content="Test content" />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-label', 'More information');
    });

    it('should support custom aria-label', () => {
      render(<InfoTooltip content="Test content" aria-label="Help for setting" />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-label', 'Help for setting');
    });
  });

  describe('tooltip content', () => {
    it('should render tooltip with role="tooltip"', () => {
      render(<InfoTooltip content="Test content" />);

      // Tooltip is always in DOM but hidden initially
      const tooltip = document.querySelector('[role="tooltip"]');
      expect(tooltip).toBeInTheDocument();
    });

    it('should display the content text', () => {
      render(<InfoTooltip content="This is the tooltip content" />);

      const tooltip = document.querySelector('[role="tooltip"]');
      expect(tooltip).toHaveTextContent('This is the tooltip content');
    });

    it('should have aria-describedby linking trigger to tooltip', () => {
      render(<InfoTooltip content="Test content" />);

      const trigger = screen.getByRole('button');
      const tooltip = document.querySelector('[role="tooltip"]');
      
      expect(trigger).toHaveAttribute('aria-describedby', tooltip?.id);
    });
  });

  describe('click/tap interaction', () => {
    it('should toggle open class on click', () => {
      render(<InfoTooltip content="Test content" />);

      const trigger = screen.getByRole('button');
      const content = screen.getByRole('tooltip', { hidden: true });

      expect(content).toHaveAttribute('aria-hidden', 'true');

      fireEvent.click(trigger);
      expect(content).toHaveAttribute('aria-hidden', 'false');

      fireEvent.click(trigger);
      expect(content).toHaveAttribute('aria-hidden', 'true');
    });

    it('should close when clicking outside', async () => {
      render(
        <div>
          <InfoTooltip content="Test content" />
          <button data-testid="outside">Outside</button>
        </div>
      );

      const trigger = screen.getByRole('button', { name: 'More information' });
      const content = screen.getByRole('tooltip', { hidden: true });

      // Open tooltip
      fireEvent.click(trigger);
      expect(content).toHaveAttribute('aria-hidden', 'false');

      // Run timer to attach click listener
      vi.runAllTimers();

      // Click outside
      fireEvent.click(screen.getByTestId('outside'));
      expect(content).toHaveAttribute('aria-hidden', 'true');
    });

    it('should close on Escape key', () => {
      render(<InfoTooltip content="Test content" />);

      const trigger = screen.getByRole('button');
      const content = screen.getByRole('tooltip', { hidden: true });

      // Open tooltip
      fireEvent.click(trigger);
      expect(content).toHaveAttribute('aria-hidden', 'false');

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(content).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('styling classes', () => {
    it('should have info-tooltip root properties', () => {
      const { container } = render(<InfoTooltip content="Test content" />);
      expect(container.firstChild).toHaveClass(styles.root);
    });

    it('should have info-tooltip content properties', () => {
      render(<InfoTooltip content="Test content" />);

      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).toHaveClass(styles.content);
    });
  });

  describe('aria-hidden state', () => {
    it('should have aria-hidden true when closed', () => {
      render(<InfoTooltip content="Test content" />);

      const tooltip = document.querySelector('[role="tooltip"]');
      expect(tooltip).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have aria-hidden false when open', () => {
      render(<InfoTooltip content="Test content" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const tooltip = document.querySelector('[role="tooltip"]');
      expect(tooltip).toHaveAttribute('aria-hidden', 'false');
    });
  });
});
