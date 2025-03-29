// src/pages/ConnectFourPage.tsx
import React, { useState, useCallback } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

type Player = 'Red' | 'Yellow';
type BoardState = (Player | null)[][];

export const ConnectFourPage: React.FC = () => {
  const ROWS = 6;
  const COLS = 7;

  const [board, setBoard] = useState<BoardState>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>('Red');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const navigate = useNavigate();
  const [showExitDialog, setShowExitDialog] = useState(false);

  const checkWinner = useCallback((boardState: BoardState): Player | 'Draw' | null => {
    // Horizontal check
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        const player = boardState[r][c];
        if (
          player &&
          player === boardState[r][c + 1] &&
          player === boardState[r][c + 2] &&
          player === boardState[r][c + 3]
        ) {
          return player;
        }
      }
    }

    // Vertical check
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS - 3; r++) {
        const player = boardState[r][c];
        if (
          player &&
          player === boardState[r + 1][c] &&
          player === boardState[r + 2][c] &&
          player === boardState[r + 3][c]
        ) {
          return player;
        }
      }
    }

    // Diagonal (positive slope) check
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        const player = boardState[r][c];
        if (
          player &&
          player === boardState[r + 1][c + 1] &&
          player === boardState[r + 2][c + 2] &&
          player === boardState[r + 3][c + 3]
        ) {
          return player;
        }
      }
    }

    // Diagonal (negative slope) check
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        const player = boardState[r][c];
        if (
          player &&
          player === boardState[r - 1][c + 1] &&
          player === boardState[r - 2][c + 2] &&
          player === boardState[r - 3][c + 3]
        ) {
          return player;
        }
      }
    }

    // Check for draw
    if (boardState.every(row => row.every(cell => cell !== null))) {
      return 'Draw';
    }

    return null;
  }, []);

  const dropToken = (col: number) => {
    // Ignore if game is over or column is full
    if (winner || board[0][col] !== null) return;

    const newBoard = board.map(row => [...row]);
    
    // Find the lowest empty row in the selected column
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newBoard[r][col] === null) {
        newBoard[r][col] = currentPlayer;
        
        // Check for winner
        const gameResult = checkWinner(newBoard);
        if (gameResult) {
          setWinner(gameResult);
        } else {
          // Switch players
          setCurrentPlayer(currentPlayer === 'Red' ? 'Yellow' : 'Red');
        }
        
        setBoard(newBoard);
        break;
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setCurrentPlayer('Red');
    setWinner(null);
  };

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (
          <div 
            key={colIndex}
            className={`
              w-16 h-16 border flex items-center justify-center 
              ${cell === 'Red' ? 'bg-red-500' : cell === 'Yellow' ? 'bg-yellow-500' : 'bg-white'}
              border-blue-500
            `}
          />
        ))}
      </div>
    ));
  };

  const renderColumnSelectors = () => {
    return (
      <div className="flex mb-4">
        {board[0].map((_, colIndex) => (
          <button
            key={colIndex}
            onClick={() => dropToken(colIndex)}
            disabled={winner !== null || board[0][colIndex] !== null}
            className={`
              w-16 h-10 border 
              ${winner ? 'cursor-not-allowed' : 'hover:bg-gray-100'}
              ${currentPlayer === 'Red' ? 'text-red-500' : 'text-yellow-500'}
            `}
          >
            Drop
          </button>
        ))}
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
        <h1 className="text-3xl font-bold mb-6">Connect Four</h1>
        
        {winner && (
          <div className="mb-4 text-2xl font-semibold">
            {winner === 'Draw' 
              ? "It's a Draw!" 
              : `${winner} Wins!`}
          </div>
        )}

        {!winner && (
          <div className="mb-4 text-xl">
            Current Player: {currentPlayer}
          </div>
        )}

        {renderColumnSelectors()}
        
        <div className="border-4 border-blue-700 inline-block">
          {renderBoard()}
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