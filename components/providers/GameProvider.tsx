'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Y from 'yjs';

interface GameContextType {
  doc: Y.Doc;
  // We will add provider/awareness here later when we implement the hook
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [doc] = useState(() => new Y.Doc());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      doc.destroy();
    };
  }, [doc]);

  return (
    <GameContext.Provider value={{ doc }}>
      {children}
    </GameContext.Provider>
  );
};
