import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { WildCardSvg } from './WildCardSvg';

describe('WildCardSvg', () => {
  describe('Wild Card Rendering', () => {
    it('should render wild card with all colors visible when no color chosen', () => {
      const { container } = render(<WildCardSvg symbol="wild" />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();

      // Should have quadrant paths with color classes
      const redQuad = container.querySelector('.quad-red');
      const blueQuad = container.querySelector('.quad-blue');
      const yellowQuad = container.querySelector('.quad-yellow');
      const greenQuad = container.querySelector('.quad-green');

      expect(redQuad).toBeInTheDocument();
      expect(blueQuad).toBeInTheDocument();
      expect(yellowQuad).toBeInTheDocument();
      expect(greenQuad).toBeInTheDocument();
    });

    it('should apply chosen-red class when red is selected', () => {
      const { container } = render(<WildCardSvg symbol="wild" color="red" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('chosen-red');
    });

    it('should apply chosen-blue class when blue is selected', () => {
      const { container } = render(<WildCardSvg symbol="wild" color="blue" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('chosen-blue');
    });

    it('should apply chosen-yellow class when yellow is selected', () => {
      const { container } = render(<WildCardSvg symbol="wild" color="yellow" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('chosen-yellow');
    });

    it('should apply chosen-green class when green is selected', () => {
      const { container } = render(<WildCardSvg symbol="wild" color="green" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('chosen-green');
    });
  });

  describe('Wild Draw Four Rendering', () => {
    it('should render wild-draw4 card with all colors visible', () => {
      const { container } = render(<WildCardSvg symbol="wild-draw4" />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();

      // Should have +4 symbols
      const paths = container.querySelectorAll('path');
      expect(paths.length).toBeGreaterThan(0);
    });

    it('should apply chosen color class to wild-draw4', () => {
      const { container } = render(<WildCardSvg symbol="wild-draw4" color="blue" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('chosen-blue');
    });
  });

  describe('Size Handling', () => {
    it('should use default md size when not specified', () => {
      const { container } = render(<WildCardSvg symbol="wild" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.width).toBe('80px');
      expect(wrapper.style.height).toBe('120px');
    });

    it('should use sm size', () => {
      const { container } = render(<WildCardSvg symbol="wild" size="sm" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.width).toBe('40px');
      expect(wrapper.style.height).toBe('60px');
    });

    it('should use lg size', () => {
      const { container } = render(<WildCardSvg symbol="wild" size="lg" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.width).toBe('56px');
      expect(wrapper.style.height).toBe('84px');
    });

    it('should use explicit width and height when provided', () => {
      const { container } = render(
        <WildCardSvg symbol="wild" width={130} height={195} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.width).toBe('130px');
      expect(wrapper.style.height).toBe('195px');
    });

    it('should prioritize explicit dimensions over size prop', () => {
      const { container } = render(
        <WildCardSvg symbol="wild" size="sm" width={100} height={150} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.width).toBe('100px');
      expect(wrapper.style.height).toBe('150px');
    });
  });
});
