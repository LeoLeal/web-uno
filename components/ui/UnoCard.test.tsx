import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UnoCard } from './UnoCard';

describe('UnoCard', () => {
  it('renders with correct alt text', () => {
    render(<UnoCard color="red" symbol="7" />);
    expect(screen.getByAltText('red 7 card')).toBeInTheDocument();
  });

  it('renders reverse card with correct alt text', () => {
    render(<UnoCard color="yellow" symbol="reverse" />);
    expect(screen.getByAltText('yellow reverse card')).toBeInTheDocument();
  });

  it('applies rotation transform', () => {
    const { container } = render(<UnoCard color="blue" symbol="0" rotation={15} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.transform).toContain('rotate(15deg)');
  });

  it('applies custom className', () => {
    const { container } = render(<UnoCard color="red" symbol="7" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders different sizes', () => {
    const { container: smContainer } = render(<UnoCard color="blue" symbol="0" size="sm" />);
    const { container: mdContainer } = render(<UnoCard color="blue" symbol="0" size="md" />);
    
    const smCard = smContainer.firstChild as HTMLElement;
    const mdCard = mdContainer.firstChild as HTMLElement;
    
    // Small should be 40px wide, medium should be 80px
    expect(smCard.style.width).toBe('40px');
    expect(mdCard.style.width).toBe('80px');
  });

  it('uses correct SVG file path for number cards', () => {
    render(<UnoCard color="red" symbol="7" />);
    const img = screen.getByAltText('red 7 card');
    expect(img).toHaveAttribute('src', expect.stringContaining('red-7.svg'));
  });

  it('renders wild cards with inline SVG', () => {
    const { container } = render(<UnoCard color="red" symbol="wild" />);
    // Wild cards now use inline SVG instead of Image component
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 60 90');
  });
});
