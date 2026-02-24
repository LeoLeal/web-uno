import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Drawer } from './Drawer';

// JSDOM doesn't implement pointer capture or ResizeObserver — mock them
beforeEach(() => {
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  global.ResizeObserver = class ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  };
});

describe('Drawer', () => {
  it('renders children when open', () => {
    render(
      <Drawer isOpen={true} onOpenChange={vi.fn()}>
        <div>Drawer Content</div>
      </Drawer>
    );
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
  });

  it('renders children when closed (still in DOM, just hidden above viewport)', () => {
    render(
      <Drawer isOpen={false} onOpenChange={vi.fn()}>
        <div>Hidden Content</div>
      </Drawer>
    );
    // Content is in the DOM even when collapsed (CSS hides it via transform)
    expect(screen.getByText('Hidden Content')).toBeInTheDocument();
  });

  it('renders a drag handle button', () => {
    render(
      <Drawer isOpen={false} onOpenChange={vi.fn()}>
        <div>Content</div>
      </Drawer>
    );
    // Use hidden: true because aria-hidden="true" hides the drawer from the a11y tree when collapsed
    const handle = screen.getByRole('button', { name: /open drawer/i, hidden: true });
    expect(handle).toBeInTheDocument();
  });

  it('handle aria-label changes based on isOpen', () => {
    const { rerender } = render(
      <Drawer isOpen={false} onOpenChange={vi.fn()}>
        <div>Content</div>
      </Drawer>
    );
    expect(screen.getByRole('button', { name: /open drawer/i, hidden: true })).toBeInTheDocument();

    rerender(
      <Drawer isOpen={true} onOpenChange={vi.fn()}>
        <div>Content</div>
      </Drawer>
    );
    expect(screen.getByRole('button', { name: /close drawer/i, hidden: true })).toBeInTheDocument();
  });

  it('calls onOpenChange(true) when handle is tapped while closed', () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer isOpen={false} onOpenChange={onOpenChange}>
        <div>Content</div>
      </Drawer>
    );
    const handle = screen.getByRole('button', { name: /open drawer/i, hidden: true });

    // Simulate a tap: pointerdown + pointerup without significant movement
    fireEvent.pointerDown(handle, { clientY: 100, pointerId: 1 });
    fireEvent.pointerUp(handle, { clientY: 100, pointerId: 1 });

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('calls onOpenChange(false) when handle is tapped while open', () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer isOpen={true} onOpenChange={onOpenChange}>
        <div>Content</div>
      </Drawer>
    );
    const handle = screen.getByRole('button', { name: /close drawer/i, hidden: true });

    fireEvent.pointerDown(handle, { clientY: 100, pointerId: 1 });
    fireEvent.pointerUp(handle, { clientY: 100, pointerId: 1 });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('sets aria-expanded on wrapper based on isOpen', () => {
    const { container, rerender } = render(
      <Drawer isOpen={false} onOpenChange={vi.fn()}>
        <div>Content</div>
      </Drawer>
    );

    // The outer wrapper div has aria-expanded, select it directly from container
    const wrapper = container.querySelector('[aria-expanded]');
    expect(wrapper).toHaveAttribute('aria-expanded', 'false');

    rerender(
      <Drawer isOpen={true} onOpenChange={vi.fn()}>
        <div>Content</div>
      </Drawer>
    );
    expect(wrapper).toHaveAttribute('aria-expanded', 'true');
  });
});
