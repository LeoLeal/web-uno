import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Logo } from './Logo';
import { CardFan } from './CardFan';
import { UnoCard } from './UnoCard';

describe('Accessibility', () => {
  describe('Logo', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Logo />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have sufficient color contrast', async () => {
      const { container } = render(<Logo />);
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('CardFan', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<CardFan />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have alt text on all card images', async () => {
      const { container } = render(<CardFan />);
      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });
  });

  describe('UnoCard', () => {
    it('should have no accessibility violations for red card', async () => {
      const { container } = render(<UnoCard color="red" symbol="5" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for blue card', async () => {
      const { container } = render(<UnoCard color="blue" symbol="skip" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for yellow card', async () => {
      const { container } = render(<UnoCard color="yellow" symbol="reverse" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for green card', async () => {
      const { container } = render(<UnoCard color="green" symbol="plus2" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have descriptive alt text', async () => {
      const { container } = render(<UnoCard color="red" symbol="7" />);
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'red 7 card');
    });
  });

  describe('Homepage components integration', () => {
    it('should have no accessibility violations when rendered together', async () => {
      const { container } = render(
        <div>
          <Logo />
          <CardFan />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
