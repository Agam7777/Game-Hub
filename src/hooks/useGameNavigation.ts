// src/hooks/useGameNavigation.ts
import { useNavigate } from 'react-router-dom';
import { GAMES } from '../constants/games';

export const useGameNavigation = () => {
  const navigate = useNavigate();

  const navigateToGame = (gameId: string) => {
    const game = GAMES.find(g => g.id === gameId);
    if (game) {
      navigate(game.path);
    }
  };

  return { navigateToGame };
};
