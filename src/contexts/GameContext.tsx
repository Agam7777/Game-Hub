// src/contexts/GameContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface GameContextType {
  score: { [key: string]: number };
  updateScore: (gameId: string, points: number) => void;
  resetScores: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [score, setScore] = useState<{ [key: string]: number }>({
    'connect-four': 0,
    'chess': 0,
    'tic-tac-toe': 0,
    'ludo': 0,
    'snakes-ladders': 0
  });

  const updateScore = (gameId: string, points: number) => {
    setScore(prev => ({
      ...prev,
      [gameId]: (prev[gameId] || 0) + points
    }));
  };

  const resetScores = () => {
    setScore({
      'connect-four': 0,
      'chess': 0,
      'tic-tac-toe': 0,
      'ludo': 0,
      'snakes-ladders': 0
    });
  };

  return (
    <GameContext.Provider value={{ score, updateScore, resetScores }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};