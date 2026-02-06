import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';

describe('Logo', () => {
  it('renders WEB UN text', () => {
    render(<Logo />);
    expect(screen.getByText('WEB UN')).toBeInTheDocument();
  });

  it('renders the card element with alt text', () => {
    render(<Logo />);
    expect(screen.getByAltText('wild card')).toBeInTheDocument();
  });

  it('card uses correct SVG file', () => {
    render(<Logo />);
    const img = screen.getByAltText('wild card');
    expect(img).toHaveAttribute('src', expect.stringContaining('wild.svg'));
  });

  it('applies custom className', () => {
    const { container } = render(<Logo className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has fade-in animation class', () => {
    const { container } = render(<Logo />);
    expect(container.firstChild).toHaveClass('animate-logo-fade-in');
  });
});
