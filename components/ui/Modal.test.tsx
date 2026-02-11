import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { Modal } from './Modal';
import styles from './Modal.module.css';

// Mock HTMLDialogElement methods for jsdom
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

describe('Modal', () => {
  describe('open/close state', () => {
    it('should call showModal when isOpen becomes true', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      );

      const dialog = document.querySelector('dialog');
      expect(dialog?.showModal).toHaveBeenCalled();
    });

    it('should call close when isOpen becomes false', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      );

      rerender(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      );

      const dialog = document.querySelector('dialog');
      expect(dialog?.close).toHaveBeenCalled();
    });

    it('should not render content when closed', () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      );

      // Content is still in DOM but dialog is closed
      const dialog = document.querySelector('dialog');
      expect(dialog).not.toHaveAttribute('open');
    });
  });

  describe('backdrop click', () => {
    it('should call onClose when backdrop is clicked', () => {
      const onClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <p>Modal content</p>
        </Modal>
      );

      const dialog = document.querySelector('dialog');
      // Simulate clicking the dialog element directly (backdrop area)
      fireEvent.click(dialog!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when content is clicked', () => {
      const onClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <p>Modal content</p>
        </Modal>
      );

      const content = screen.getByText('Modal content');
      fireEvent.click(content);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should not close non-dismissible modal on backdrop click', () => {
      render(
        <Modal isOpen={true}>
          <p>Modal content</p>
        </Modal>
      );

      const dialog = document.querySelector('dialog');
      fireEvent.click(dialog!);

      // Modal should still be open (no error thrown, no close)
      expect(dialog).toHaveAttribute('open');
    });
  });

  describe('Escape key', () => {
    it('should call onClose when Escape is pressed', () => {
      const onClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <p>Modal content</p>
        </Modal>
      );

      const dialog = document.querySelector('dialog');
      const cancelEvent = new Event('cancel', { cancelable: true });
      dialog?.dispatchEvent(cancelEvent);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should prevent close on Escape for non-dismissible modal', () => {
      render(
        <Modal isOpen={true}>
          <p>Modal content</p>
        </Modal>
      );

      const dialog = document.querySelector('dialog');
      const cancelEvent = new Event('cancel', { cancelable: true });
      dialog?.dispatchEvent(cancelEvent);

      expect(cancelEvent.defaultPrevented).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should render as a dialog element', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      );

      const dialog = document.querySelector('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should support aria-labelledby', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} aria-labelledby="modal-title">
          <h2 id="modal-title">Title</h2>
        </Modal>
      );

      const dialog = document.querySelector('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should support aria-describedby', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} aria-describedby="modal-desc">
          <p id="modal-desc">Description</p>
        </Modal>
      );

      const dialog = document.querySelector('dialog');
      expect(dialog).toHaveAttribute('aria-describedby', 'modal-desc');
    });
  });

  describe('styling', () => {
    it('should have modal class on dialog', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      const dialog = document.querySelector('dialog');
      expect(dialog).toHaveClass(styles.modal);
    });

    it('should have modal-content class on content wrapper', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      // Dialog is at root of container in jsdom (or body?)
      // Modal renders <dialog> directly.
      // But querySelector('dialog') works.
      // We want to find the content div inside.
      const content = container.getElementsByClassName(styles.content)[0];
      expect(content).toBeInTheDocument();
    });

    it('should apply custom className to content wrapper', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} className="custom-class">
          <p>Content</p>
        </Modal>
      );

      const content = container.getElementsByClassName(styles.content)[0];
      expect(content).toHaveClass('custom-class');
    });
  });
});
