import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToggleSwitch } from './ToggleSwitch';

describe('ToggleSwitch', () => {
  describe('rendering', () => {
    it('should render as a button with switch role', () => {
      render(<ToggleSwitch checked={false} onChange={vi.fn()} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toBeInTheDocument();
      expect(toggle.tagName).toBe('BUTTON');
    });

    it('should have toggle-switch class', () => {
      render(<ToggleSwitch checked={false} onChange={vi.fn()} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('toggle-switch');
    });
  });

  describe('checked state', () => {
    it('should have aria-checked false when unchecked', () => {
      render(<ToggleSwitch checked={false} onChange={vi.fn()} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });

    it('should have aria-checked true when checked', () => {
      render(<ToggleSwitch checked={true} onChange={vi.fn()} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('click interaction', () => {
    it('should call onChange with true when clicking unchecked toggle', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch checked={false} onChange={onChange} />);

      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('should call onChange with false when clicking checked toggle', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch checked={true} onChange={onChange} />);

      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  describe('keyboard interaction', () => {
    it('should toggle on Space key', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch checked={false} onChange={onChange} />);

      const toggle = screen.getByRole('switch');
      fireEvent.keyDown(toggle, { key: ' ' });

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('should toggle on Enter key', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch checked={false} onChange={onChange} />);

      const toggle = screen.getByRole('switch');
      fireEvent.keyDown(toggle, { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('should not toggle on other keys', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch checked={false} onChange={onChange} />);

      const toggle = screen.getByRole('switch');
      fireEvent.keyDown(toggle, { key: 'a' });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('should have disabled attribute when disabled', () => {
      render(<ToggleSwitch checked={false} onChange={vi.fn()} disabled />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toBeDisabled();
    });

    it('should not call onChange when clicking disabled toggle', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch checked={false} onChange={onChange} disabled />);

      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not toggle on keyboard when disabled', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch checked={false} onChange={onChange} disabled />);

      const toggle = screen.getByRole('switch');
      fireEvent.keyDown(toggle, { key: ' ' });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should support aria-label', () => {
      render(
        <ToggleSwitch
          checked={false}
          onChange={vi.fn()}
          aria-label="Enable notifications"
        />
      );

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-label', 'Enable notifications');
    });

    it('should support aria-labelledby', () => {
      render(
        <>
          <label id="label-id">Enable notifications</label>
          <ToggleSwitch
            checked={false}
            onChange={vi.fn()}
            aria-labelledby="label-id"
          />
        </>
      );

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-labelledby', 'label-id');
    });

    it('should support id prop', () => {
      render(<ToggleSwitch checked={false} onChange={vi.fn()} id="my-toggle" />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('id', 'my-toggle');
    });
  });
});
