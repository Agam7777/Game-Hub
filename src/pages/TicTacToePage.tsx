// src/pages/TicTacToePage.tsx
import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

type Player = 'X' | 'O' | null;
type BoardState = Player[];

export const TicTacToePage: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const navigate = useNavigate();
  const [showExitDialog, setShowExitDialog] = useState(false);

  const checkWinner = (boardState: BoardState): Player | 'Draw' | null => {
    const winningCombos = [
      // Rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonals
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        return boardState[a];
      }
    }

    // Check for draw
    if (boardState.every(cell => cell !== null)) {
      return 'Draw';
    }

    return null;
  };

  const handleCellClick = (index: number) => {
    // Ignore click if cell is already filled or game is over
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
    } else {
      // Switch players
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const renderCell = (index: number) => {
    const value = board[index];
    return (
      <div 
        key={index}
        onClick={() => handleCellClick(index)}
        className={`
          w-24 h-24 border flex items-center justify-center text-6xl cursor-pointer
          ${value ? 'cursor-not-allowed' : 'hover:bg-gray-100'}
          ${value === 'X' ? 'text-blue-500' : 'text-red-500'}
        `}
      >
        {value}
      </div>
    );
  };

  const handleExitToHome = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    navigate('/');
  };

  const cancelExit = () => {
    setShowExitDialog(false);
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center">
        {/* Home Button */}
          <Button 
            onClick={handleExitToHome}
            variant="ghost"
            className="absolute left-5 top-5 text-2xl p-5"
          >
            ← Home
          </Button>
        <h1 className="text-3xl font-bold mb-6">Tic Tac Toe</h1>
        
        {winner && (
          <div className="mb-4 text-2xl font-semibold">
            {winner === 'Draw' 
              ? "It's a Draw!" 
              : `Player ${winner} Wins!`}
          </div>
        )}

        {!winner && (
          <div className="mb-4 text-xl">
            Current Player: {currentPlayer}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mb-6">
          {board.map((_, index) => renderCell(index))}
        </div>

        <Button 
          onClick={resetGame}
          variant="outline"
          className="mt-4"
        >
          Reset Game
        </Button>
      </div>
      {/* Custom Exit Confirmation Dialog */}
        {showExitDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm">
              <h3 className="text-lg font-bold mb-2">Leave Current Game?</h3>
              <p className="mb-4">Your current game progress will be lost and cannot be recovered.</p>
              <div className="flex justify-end space-x-2">
                <Button 
                  onClick={cancelExit}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmExit}
                  variant="destructive"
                >
                  Leave Game
                </Button>
              </div>
            </div>
          </div>
        )}
    </PageLayout>
  );
};