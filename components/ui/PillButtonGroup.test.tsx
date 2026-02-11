import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PillButtonGroup } from './PillButtonGroup';

const defaultOptions = [
  { value: 5, label: '5' },
  { value: 7, label: '7' },
  { value: 10, label: '10' },
];

describe('PillButtonGroup', () => {
  describe('rendering', () => {
    it('should render all options as buttons', () => {
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={vi.fn()}
          aria-label="Hand size"
        />
      );

      expect(screen.getByRole('radio', { name: '5' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '7' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '10' })).toBeInTheDocument();
    });

    it('should have radiogroup role on container', () => {
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={vi.fn()}
          aria-label="Hand size"
        />
      );

      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('should apply aria-label to radiogroup', () => {
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={vi.fn()}
          aria-label="Hand size"
        />
      );

      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', 'Hand size');
    });
  });

  describe('selection state', () => {
    it('should mark selected option with aria-checked true', () => {
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={vi.fn()}
          aria-label="Hand size"
        />
      );

      expect(screen.getByRole('radio', { name: '7' })).toHaveAttribute('aria-checked', 'true');
    });

    it('should mark unselected options with aria-checked false', () => {
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={vi.fn()}
          aria-label="Hand size"
        />
      );

      expect(screen.getByRole('radio', { name: '5' })).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByRole('radio', { name: '10' })).toHaveAttribute('aria-checked', 'false');
    });

    it('should have tabIndex 0 only on selected option', () => {
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={vi.fn()}
          aria-label="Hand size"
        />
      );

      expect(screen.getByRole('radio', { name: '7' })).toHaveAttribute('tabIndex', '0');
      expect(screen.getByRole('radio', { name: '5' })).toHaveAttribute('tabIndex', '-1');
      expect(screen.getByRole('radio', { name: '10' })).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('click interaction', () => {
    it('should call onChange when clicking unselected option', () => {
      const onChange = vi.fn();
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={onChange}
          aria-label="Hand size"
        />
      );

      fireEvent.click(screen.getByRole('radio', { name: '10' }));

      expect(onChange).toHaveBeenCalledWith(10);
    });

    it('should not call onChange when clicking selected option', () => {
      const onChange = vi.fn();
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={onChange}
          aria-label="Hand size"
        />
      );

      fireEvent.click(screen.getByRole('radio', { name: '7' }));

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('keyboard navigation', () => {
    it('should navigate to next option on ArrowRight', () => {
      const onChange = vi.fn();
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={onChange}
          aria-label="Hand size"
        />
      );

      const selectedOption = screen.getByRole('radio', { name: '7' });
      fireEvent.keyDown(selectedOption, { key: 'ArrowRight' });

      expect(onChange).toHaveBeenCalledWith(10);
    });

    it('should navigate to previous option on ArrowLeft', () => {
      const onChange = vi.fn();
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={onChange}
          aria-label="Hand size"
        />
      );

      const selectedOption = screen.getByRole('radio', { name: '7' });
      fireEvent.keyDown(selectedOption, { key: 'ArrowLeft' });

      expect(onChange).toHaveBeenCalledWith(5);
    });

    it('should wrap around from last to first on ArrowRight', () => {
      const onChange = vi.fn();
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={10}
          onChange={onChange}
          aria-label="Hand size"
        />
      );

      const selectedOption = screen.getByRole('radio', { name: '10' });
      fireEvent.keyDown(selectedOption, { key: 'ArrowRight' });

      expect(onChange).toHaveBeenCalledWith(5);
    });

    it('should wrap around from first to last on ArrowLeft', () => {
      const onChange = vi.fn();
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={5}
          onChange={onChange}
          aria-label="Hand size"
        />
      );

      const selectedOption = screen.getByRole('radio', { name: '5' });
      fireEvent.keyDown(selectedOption, { key: 'ArrowLeft' });

      expect(onChange).toHaveBeenCalledWith(10);
    });

    it('should select current option on Space', () => {
      const onChange = vi.fn();
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={onChange}
          aria-label="Hand size"
        />
      );

      const option = screen.getByRole('radio', { name: '5' });
      option.focus();
      fireEvent.keyDown(option, { key: ' ' });

      expect(onChange).toHaveBeenCalledWith(5);
    });

    it('should select current option on Enter', () => {
      const onChange = vi.fn();
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={onChange}
          aria-label="Hand size"
        />
      );

      const option = screen.getByRole('radio', { name: '5' });
      option.focus();
      fireEvent.keyDown(option, { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith(5);
    });
  });

  describe('disabled state', () => {
    it('should disable all buttons when disabled', () => {
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={vi.fn()}
          aria-label="Hand size"
          disabled
        />
      );

      const buttons = screen.getAllByRole('radio');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('should not call onChange when clicking disabled option', () => {
      const onChange = vi.fn();
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={onChange}
          aria-label="Hand size"
          disabled
        />
      );

      fireEvent.click(screen.getByRole('radio', { name: '10' }));

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not navigate when disabled', () => {
      const onChange = vi.fn();
      render(
        <PillButtonGroup
          options={defaultOptions}
          value={7}
          onChange={onChange}
          aria-label="Hand size"
          disabled
        />
      );

      const selectedOption = screen.getByRole('radio', { name: '7' });
      fireEvent.keyDown(selectedOption, { key: 'ArrowRight' });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('null value support', () => {
    it('should support null as a value', () => {
      const options = [
        { value: 100, label: '100' },
        { value: null, label: '∞' },
      ];

      render(
        <PillButtonGroup
          options={options}
          value={null}
          onChange={vi.fn()}
          aria-label="Score limit"
        />
      );

      expect(screen.getByRole('radio', { name: '∞' })).toHaveAttribute('aria-checked', 'true');
    });
  });
});
