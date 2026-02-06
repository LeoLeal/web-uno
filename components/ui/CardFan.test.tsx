import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardFan } from './CardFan';

describe('CardFan', () => {
  it('renders 4 cards with alt texts', () => {
    render(<CardFan />);
    
    expect(screen.getByAltText('red plus2 card')).toBeInTheDocument();
    expect(screen.getByAltText('blue skip card')).toBeInTheDocument();
    expect(screen.getByAltText('yellow reverse card')).toBeInTheDocument();
    expect(screen.getByAltText('green reverse card')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<CardFan className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has card-fan animation class on wrappers', () => {
    const { container } = render(<CardFan />);
    const animatedWrappers = container.querySelectorAll('.animate-card-fan');
    expect(animatedWrappers.length).toBe(4);
  });

  it('last card (green) is hidden on mobile', () => {
    const { container } = render(<CardFan />);
    const wrappers = container.querySelectorAll('.animate-card-fan');
    
    // The 4th wrapper (index 3) should have 'hidden sm:block' classes
    expect(wrappers[3]).toHaveClass('hidden');
    expect(wrappers[3]).toHaveClass('sm:block');
  });

  it('uses correct SVG file paths', () => {
    render(<CardFan />);
    
    const redPlus2 = screen.getByAltText('red plus2 card');
    const blueSkip = screen.getByAltText('blue skip card');
    
    expect(redPlus2).toHaveAttribute('src', expect.stringContaining('red-plus2.svg'));
    expect(blueSkip).toHaveAttribute('src', expect.stringContaining('blue-skip.svg'));
  });
});
