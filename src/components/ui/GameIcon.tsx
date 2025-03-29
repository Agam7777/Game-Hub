// src/utils/gameIcons.tsx
import React from 'react';
import { 
  TrophyIcon, 
  Minus, 
  X, 
  Dice6, 
  Scaling 
} from 'lucide-react';

export const getGameIcon = (gameId: string, className?: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'chess': <TrophyIcon className={className} />,
    'connect-four': <Minus className={className} />,
    'tic-tac-toe': <X className={className} />,
    'ludo': <Dice6 className={className} />,
    'snakes-ladders': <Scaling className={className} />
  };

  return iconMap[gameId] || null;
};