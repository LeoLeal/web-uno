import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
  it('calls onSendMessage and clears input on submit', () => {
    const onSendMessage = vi.fn();
    render(<ChatInput onSendMessage={onSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type a chat message...') as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: 'Test message' } });
    expect(input.value).toBe('Test message');
    
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(onSendMessage).toHaveBeenCalledWith('Test message');
    expect(input.value).toBe('');
  });

  it('disables send button when input is empty or whitespace', () => {
    const onSendMessage = vi.fn();
    render(<ChatInput onSendMessage={onSendMessage} />);
    
    // The button has aria-label "Send message"
    const button = screen.getByRole('button', { name: /send message/i });
    expect(button).toBeDisabled();
    
    const input = screen.getByPlaceholderText('Type a chat message...');
    fireEvent.change(input, { target: { value: '   ' } });
    expect(button).toBeDisabled();
    
    fireEvent.change(input, { target: { value: 'Valid' } });
    expect(button).not.toBeDisabled();
  });

  it('keeps focus after send by default', () => {
    const onSendMessage = vi.fn();
    render(<ChatInput onSendMessage={onSendMessage} />);

    const input = screen.getByPlaceholderText('Type a chat message...') as HTMLTextAreaElement;
    input.focus();
    fireEvent.change(input, { target: { value: 'Default focus behavior' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onSendMessage).toHaveBeenCalledWith('Default focus behavior');
    expect(document.activeElement).toBe(input);
  });

  it('blurs input after send when focus behavior is blur', () => {
    const onSendMessage = vi.fn();
    render(<ChatInput onSendMessage={onSendMessage} focusBehaviorOnSubmit="blur" />);

    const input = screen.getByPlaceholderText('Type a chat message...') as HTMLTextAreaElement;
    input.focus();
    fireEvent.change(input, { target: { value: 'Blur this input' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onSendMessage).toHaveBeenCalledWith('Blur this input');
    expect(document.activeElement).not.toBe(input);
  });
});
