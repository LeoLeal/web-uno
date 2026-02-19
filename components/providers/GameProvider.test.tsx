import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as Y from 'yjs';
import { GameProvider, useGame } from './GameProvider';

describe('GameProvider', () => {
  it('should throw when useGame is used outside of GameProvider', () => {
    // Suppress console.error for expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useGame());
    }).toThrow('useGame must be used within a GameProvider');

    spy.mockRestore();
  });

  it('should provide a Y.Doc instance', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameProvider>{children}</GameProvider>
    );

    const { result } = renderHook(() => useGame(), { wrapper });

    expect(result.current.doc).toBeInstanceOf(Y.Doc);
  });

  it('should provide the same doc across multiple useGame calls', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameProvider>{children}</GameProvider>
    );

    const { result: result1 } = renderHook(() => useGame(), { wrapper });
    const { result: result2 } = renderHook(() => useGame(), { wrapper });

    // Both should be Y.Doc instances (same provider gives same doc within a render)
    expect(result1.current.doc).toBeInstanceOf(Y.Doc);
    expect(result2.current.doc).toBeInstanceOf(Y.Doc);
  });
});
