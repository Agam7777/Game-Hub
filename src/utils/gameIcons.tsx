// src/utils/gameIcons.tsx
import React from 'react';

export const getGameIcon = (gameId: string, className: string = 'w-12 h-12') => {
  switch (gameId) {
    case 'connect-four':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-blue-500`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 8h16v8H4z"/>
          <path d="M2 4h20v16H2z" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case 'chess':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-gray-700`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      );
    case 'tic-tac-toe':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-green-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="3" x2="9" y2="3"/>
          <line x1="15" y1="3" x2="21" y2="3"/>
          <line x1="3" y1="9" x2="9" y2="9"/>
          <line x1="15" y1="9" x2="21" y2="9"/>
          <line x1="3" y1="15" x2="9" y2="15"/>
          <line x1="15" y1="15" x2="21" y2="15"/>
        </svg>
      );
    case 'ludo':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-purple-500`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3 6h6l-3 6 3 6h-6l-3 6-3-6H3l3-6-3-6h6z"/>
        </svg>
      );
    case 'snakes-ladders':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-red-500`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 6l-3 4 3 4-3 4 3 4H6l3-4-3-4 3-4-3-4h12z"/>
        </svg>
      );
    default:
      return null;
  }
};