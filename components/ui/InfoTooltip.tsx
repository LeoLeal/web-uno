'use client';

import { useState, useCallback, useRef, useEffect, useId } from 'react';
import { Info } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './InfoTooltip.module.css';

interface InfoTooltipProps {
  /** The tooltip content text */
  content: string;
  /** Accessible label for the trigger button */
  'aria-label'?: string;
}

/**
 * Info tooltip component with an info icon trigger.
 * 
 * Desktop: Shows tooltip on hover/focus
 * Mobile: Shows tooltip on tap, hides on tap elsewhere
 * 
 * Uses CSS anchor positioning for placement with fallbacks.
 */
export const InfoTooltip = ({
  content,
  'aria-label': ariaLabel = 'More information',
}: InfoTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle tap toggle for mobile
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  // Close when clicking outside (mobile)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    // Use setTimeout to avoid closing immediately from the same click
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={clsx(styles.root, isOpen && styles.open)}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-label={ariaLabel}
        aria-describedby={tooltipId}
        onClick={handleClick}
      >
        <Info size={16} />
      </button>
      <div
        id={tooltipId}
        role="tooltip"
        className={styles.content}
        aria-hidden={!isOpen}
      >
        {content}
      </div>
    </div>
  );
};
