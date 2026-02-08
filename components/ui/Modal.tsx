'use client';

import { useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import styles from './Modal.module.css';

interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Called when the modal should close. If undefined, modal is non-dismissible. */
  onClose?: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Additional classes for the modal content wrapper */
  className?: string;
  /** ID of the element that labels the modal */
  'aria-labelledby'?: string;
  /** ID of the element that describes the modal */
  'aria-describedby'?: string;
}

/**
 * Modal component using native <dialog> element.
 * 
 * Features:
 * - Built-in focus trap when opened with .showModal()
 * - Native ::backdrop pseudo-element
 * - Escape key handling via cancel event
 * - Top-layer rendering (no z-index management)
 * - Backdrop click to close (when onClose provided)
 */
export const Modal = ({
  isOpen,
  onClose,
  children,
  className = '',
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync isOpen with dialog state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle cancel event (Escape key)
  const handleCancel = (e: React.SyntheticEvent) => {
    if (onClose) {
      onClose();
    } else {
      // Non-dismissible: prevent Escape from closing
      e.preventDefault();
    }
  };

  // Handle backdrop click
  // When clicking the dialog element itself (not children), it means backdrop was clicked
  const handleClick = (e: React.MouseEvent) => {
    if (onClose && e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleClick}
      className={styles.modal}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
    >
      <div className={clsx(styles.content, className)}>
        {children}
      </div>
    </dialog>
  );
};
