// src/constants/games.ts
import { GameInfo } from '../types/Game';

export const GAMES: GameInfo[] = [
  {
    id: 'connect-four',
    name: 'Connect Four',
    path: '/connect-four'
  },
  {
    id: 'chess',
    name: 'Chess',
    path: '/chess'
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    path: '/tic-tac-toe'
  },
  {
    id: 'ludo',
    name: 'Ludo / Parcheesi',
    path: '/ludo'
  },
  {
    id: 'snakes-ladders',
    name: 'Snakes and Ladders',
    path: '/snakes-ladders'
  }
];
