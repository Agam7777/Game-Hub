// src/hooks/useGameState.ts
import { useState } from 'react';

export const useGameState = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const [history, setHistory] = useState<T[]>([initialState]);

  const updateState = (newState: T) => {
    setState(newState);
    setHistory(prev => [...prev, newState]);
  };

  const resetState = () => {
    setState(initialState);
    setHistory([initialState]);
  };

  const undoLastMove = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current state
      setState(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  };

  return { 
    state, 
    setState: updateState, 
    resetState, 
    undoLastMove 
  };
};