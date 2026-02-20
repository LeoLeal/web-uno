import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChatBalloon } from './ChatBalloon';

describe('ChatBalloon', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(10000)); // Current simulated time is 10000
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders messages correctly', () => {
    const messages = [
      { id: '1', clientId: 1, text: 'Hello', timestamp: 5000 }
    ];
    render(<ChatBalloon messages={messages} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('fades out messages after 9.5 seconds (opacity-0 CSS class)', () => {
    // Message sent at time 0. Current time is 10000 (10s later)
    // Actually, visible messages are < 10000. Let's make it 9600s old
    const messages = [
      { id: '1', clientId: 1, text: 'Hello', timestamp: 400 }
    ];
    render(<ChatBalloon messages={messages} />);
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    const msg = screen.getByText('Hello');
    expect(msg).toHaveClass('opacity-0');
  });

  it('keeps recent messages visible immediately', () => {
    const messages = [
      { id: '1', clientId: 1, text: 'Hello', timestamp: 9000 } // 1s old
    ];
    render(<ChatBalloon messages={messages} />);
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    const msg = screen.getByText('Hello');
    expect(msg).toHaveClass('opacity-100');
  });

  it('appends messages arriving within 10 seconds', () => {
    const messages = [
      { id: '1', clientId: 1, text: 'Hello', timestamp: 5000 },
      { id: '2', clientId: 1, text: 'World', timestamp: 8000 }
    ];
    render(<ChatBalloon messages={messages} />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
  });
});
