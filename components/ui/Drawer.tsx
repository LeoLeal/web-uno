'use client';

import { useRef, useState, useCallback, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';
import styles from './Drawer.module.css';

export interface DrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Generic top-edge retractable drawer.
 * When collapsed, only the drag handle peeks out at the top of the viewport.
 * When open, the content slides down, with the handle at its bottom edge.
 * Only visible below the `md` Tailwind breakpoint (hidden on desktop).
 *
 * Supports:
 * - Tap handle to toggle open/closed
 * - Full drag gesture (pointer events) with velocity-based snapping
 */
export const Drawer = ({ isOpen, onOpenChange, children, className }: DrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Height of the content panel (not including the handle).
  // We translate the drawer upward by exactly this amount to hide only the content,
  // keeping the handle peeking out at the top of the viewport.
  const [panelHeight, setPanelHeight] = useState(0);

  // Measure panel height on mount and whenever children change
  useLayoutEffect(() => {
    const measure = () => {
      if (panelRef.current) {
        setPanelHeight(panelRef.current.offsetHeight);
      }
    };
    measure();
    // Re-measure if content resizes (e.g. virtual keyboard causes layout shift)
    const observer = new ResizeObserver(measure);
    if (panelRef.current) observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, [children]);

  // Drag state — tracked via refs to avoid re-renders during gesture
  const dragStartY = useRef<number>(0);
  const dragStartTranslate = useRef<number>(0);
  const dragCurrentY = useRef<number>(0);
  const dragStartTime = useRef<number>(0);
  const hasDragged = useRef<boolean>(false);

  /** Apply a raw pixel transform during dragging (bypasses state-driven inline style) */
  const applyTransform = useCallback((translateY: number) => {
    if (!drawerRef.current) return;
    drawerRef.current.style.transform = `translateY(${translateY}px)`;
    drawerRef.current.style.transition = 'none';
  }, []);

  /** Reset inline transform/transition so state-driven style takes over */
  const clearTransform = useCallback(() => {
    if (!drawerRef.current) return;
    drawerRef.current.style.transform = '';
    drawerRef.current.style.transition = '';
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartY.current = e.clientY;
    dragCurrentY.current = e.clientY;
    dragStartTime.current = Date.now();
    hasDragged.current = false;
    // Where does the drawer start from?
    // Open → translateY(0), Closed → translateY(-panelHeight)
    dragStartTranslate.current = isOpen ? 0 : -panelHeight;
    setIsDragging(true);
  }, [isOpen, panelHeight]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    dragCurrentY.current = e.clientY;
    const delta = e.clientY - dragStartY.current;

    if (Math.abs(delta) > 5) {
      hasDragged.current = true;
    }

    // Clamp: can't drag above the collapsed position or below the open position
    const rawTranslate = dragStartTranslate.current + delta;
    const clamped = Math.max(-panelHeight, Math.min(0, rawTranslate));
    applyTransform(clamped);
  }, [isDragging, panelHeight, applyTransform]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;

    const delta = dragCurrentY.current - dragStartY.current;
    const elapsed = Date.now() - dragStartTime.current;
    const velocity = elapsed > 0 ? Math.abs(delta) / elapsed : 0; // px/ms
    const threshold = panelHeight * 0.30;
    const isSwipe = velocity > 0.5;

    clearTransform();
    setIsDragging(false);

    if (hasDragged.current) {
      if (isOpen) {
        // Dragging up (negative delta) to close
        if (delta < -threshold || (isSwipe && delta < 0)) {
          onOpenChange(false);
        } else {
          onOpenChange(true); // bounce back
        }
      } else {
        // Dragging down (positive delta) to open
        if (delta > threshold || (isSwipe && delta > 0)) {
          onOpenChange(true);
        } else {
          onOpenChange(false); // bounce back
        }
      }
    } else {
      // Pure tap — toggle
      onOpenChange(!isOpen);
    }
  }, [isDragging, isOpen, panelHeight, clearTransform, onOpenChange]);

  const handlePointerCancel = useCallback(() => {
    clearTransform();
    setIsDragging(false);
  }, [clearTransform]);

  // The collapsed translateY: move the content panel up, handle stays visible
  const collapsedTranslate = panelHeight > 0 ? -panelHeight : -200;
  const translateY = isOpen ? 0 : collapsedTranslate;

  return (
    <div
      ref={drawerRef}
      className={cn(
        styles.drawer,
        'md:hidden',
        className
      )}
      style={{ transform: `translateY(${translateY}px)` }}
      aria-expanded={isOpen}
      aria-hidden={!isOpen}
    >
      {/* Content panel — revealed above the handle when drawer opens */}
      <div ref={panelRef} data-drawer-panel className={styles.panel}>
        {children}
      </div>

      {/* Drag handle — always visible at the bottom edge of the drawer */}
      <button
        type="button"
        className={styles.handle}
        aria-label={isOpen ? 'Close drawer' : 'Open drawer'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className={styles.handleBar} />
        <span className={styles.handleLabel}>pull to send message</span>
      </button>
    </div>
  );
};
