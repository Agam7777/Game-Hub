// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ChessPage } from './pages/ChessPage';
import { ConnectFourPage } from './pages/ConnectFourPage';
import { TicTacToePage } from './pages/TicTacToePage';
import { LudoPage } from './pages/LudoPage';
import { SnakesAndLaddersPage } from './pages/SnakesAndLaddersPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chess" element={<ChessPage />} />
        <Route path="/connect-four" element={<ConnectFourPage />} />
        <Route path="/tic-tac-toe" element={<TicTacToePage />} />
        <Route path="/ludo" element={<LudoPage />} />
        <Route path="/snakes-ladders" element={<SnakesAndLaddersPage />} />
      </Routes>
    </Router>
  );
};

export default App;