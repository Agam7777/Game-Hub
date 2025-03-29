// src/pages/ChessPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/button';

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type Color = 'white' | 'black';

interface Piece {
  type: PieceType;
  color: Color;
  position: string;
  hasMoved?: boolean;
}

const pieceSymbols = {
  king: { white: '♔', black: '♚' },
  queen: { white: '♕', black: '♛' },
  rook: { white: '♖', black: '♜' },
  bishop: { white: '♗', black: '♝' },
  knight: { white: '♘', black: '♞' },
  pawn: { white: '♙', black: '♟' },
};

const notationToIndices = (position: string): [number, number] | null => {
  if (position.length !== 2) return null;
  const col = position.charCodeAt(0) - 97;
  const row = 8 - parseInt(position[1]);
  if (col < 0 || col > 7 || row < 0 || row > 7) return null;
  return [row, col];
};

const indicesToNotation = (row: number, col: number): string => {
  return `${String.fromCharCode(97 + col)}${8 - row}`;
};

export const ChessPage: React.FC = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState<(Piece | null)[][]>(
    Array(8).fill(null).map(() => Array(8).fill(null))
  );
  const [selectedPiece, setSelectedPiece] = useState<{
    piece: Piece | null;
    position: string | null;
  }>({ piece: null, position: null });
  const [currentPlayer, setCurrentPlayer] = useState<Color>('white');
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const initializeBoard = () => {
    const newBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Set up pawns
    for (let i = 0; i < 8; i++) {
      // White pawns (row 6)
      newBoard[6][i] = { 
        type: 'pawn', 
        color: 'white', 
        position: `${String.fromCharCode(97 + i)}2`,
        hasMoved: false
      };
      // Black pawns (row 1)
      newBoard[1][i] = { 
        type: 'pawn', 
        color: 'black', 
        position: `${String.fromCharCode(97 + i)}7`,
        hasMoved: false
      };
    }

    // Set up white pieces (row 7)
    const whitePieces = [
      { type: 'rook', col: 0, pos: 'a1' },
      { type: 'knight', col: 1, pos: 'b1' },
      { type: 'bishop', col: 2, pos: 'c1' },
      { type: 'queen', col: 3, pos: 'd1' },
      { type: 'king', col: 4, pos: 'e1' },
      { type: 'bishop', col: 5, pos: 'f1' },
      { type: 'knight', col: 6, pos: 'g1' },
      { type: 'rook', col: 7, pos: 'h1' },
    ];

    whitePieces.forEach(({ type, col, pos }) => {
      const [row, _] = notationToIndices(pos)!;
      newBoard[row][col] = { type, color: 'white', position: pos, hasMoved: false };
    });

    // Set up black pieces (row 0)
    const blackPieces = [
      { type: 'rook', col: 0, pos: 'a8' },
      { type: 'knight', col: 1, pos: 'b8' },
      { type: 'bishop', col: 2, pos: 'c8' },
      { type: 'queen', col: 3, pos: 'd8' },
      { type: 'king', col: 4, pos: 'e8' },
      { type: 'bishop', col: 5, pos: 'f8' },
      { type: 'knight', col: 6, pos: 'g8' },
      { type: 'rook', col: 7, pos: 'h8' },
    ];

    blackPieces.forEach(({ type, col, pos }) => {
      const [row, _] = notationToIndices(pos)!;
      newBoard[row][col] = { type, color: 'black', position: pos, hasMoved: false };
    });

    setBoard(newBoard);
  };

  const resetGame = () => {
    initializeBoard();
    setCurrentPlayer('white');
    setSelectedPiece({ piece: null, position: null });
    setValidMoves([]);
  };

  const calculateValidMoves = (piece: Piece, position: string): string[] => {
    const [currentRow, currentCol] = notationToIndices(position)!;
    const moves: string[] = [];

    const addMove = (row: number, col: number) => {
      if (row >= 0 && row < 8 && col >= 0 && col < 8) {
        const targetPiece = board[row][col];
        if (!targetPiece || targetPiece.color !== piece.color) {
          moves.push(indicesToNotation(row, col));
        }
      }
    };

    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        // Forward move
        if (!board[currentRow + direction][currentCol]) {
          addMove(currentRow + direction, currentCol);
          // Double move from starting position
          const startRow = piece.color === 'white' ? 6 : 1;
          if (currentRow === startRow && !board[currentRow + 2 * direction][currentCol]) {
            addMove(currentRow + 2 * direction, currentCol);
          }
        }
        // Capture moves
        for (const colOffset of [-1, 1]) {
          const newCol = currentCol + colOffset;
          if (newCol >= 0 && newCol < 8) {
            const targetPiece = board[currentRow + direction][newCol];
            if (targetPiece && targetPiece.color !== piece.color) {
              addMove(currentRow + direction, newCol);
            }
          }
        }
        break;

      case 'rook':
        for (const [rowDir, colDir] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          for (let i = 1; i < 8; i++) {
            const newRow = currentRow + i * rowDir;
            const newCol = currentCol + i * colDir;
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            const targetPiece = board[newRow][newCol];
            if (!targetPiece) {
              addMove(newRow, newCol);
            } else {
              if (targetPiece.color !== piece.color) {
                addMove(newRow, newCol);
              }
              break;
            }
          }
        }
        break;

      case 'knight':
        for (const [rowOffset, colOffset] of [
          [2, 1], [2, -1], [-2, 1], [-2, -1],
          [1, 2], [1, -2], [-1, 2], [-1, -2]
        ]) {
          addMove(currentRow + rowOffset, currentCol + colOffset);
        }
        break;

      case 'bishop':
        for (const [rowDir, colDir] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          for (let i = 1; i < 8; i++) {
            const newRow = currentRow + i * rowDir;
            const newCol = currentCol + i * colDir;
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            const targetPiece = board[newRow][newCol];
            if (!targetPiece) {
              addMove(newRow, newCol);
            } else {
              if (targetPiece.color !== piece.color) {
                addMove(newRow, newCol);
              }
              break;
            }
          }
        }
        break;

      case 'queen':
        for (const [rowDir, colDir] of [
          [1, 0], [-1, 0], [0, 1], [0, -1],
          [1, 1], [1, -1], [-1, 1], [-1, -1]
        ]) {
          for (let i = 1; i < 8; i++) {
            const newRow = currentRow + i * rowDir;
            const newCol = currentCol + i * colDir;
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            const targetPiece = board[newRow][newCol];
            if (!targetPiece) {
              addMove(newRow, newCol);
            } else {
              if (targetPiece.color !== piece.color) {
                addMove(newRow, newCol);
              }
              break;
            }
          }
        }
        break;

      case 'king':
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
          for (let colOffset = -1; colOffset <= 1; colOffset++) {
            if (rowOffset === 0 && colOffset === 0) continue;
            addMove(currentRow + rowOffset, currentCol + colOffset);
          }
        }
        break;
    }

    return moves;
  };

  const handleSquareClick = (position: string) => {
    const [row, col] = notationToIndices(position)!;
    const clickedPiece = board[row][col];

    if (clickedPiece && clickedPiece.color === currentPlayer) {
      setSelectedPiece({ piece: clickedPiece, position });
      setValidMoves(calculateValidMoves(clickedPiece, position));
      return;
    }

    if (!selectedPiece.piece) return;

    if (validMoves.includes(position)) {
      const [fromRow, fromCol] = notationToIndices(selectedPiece.position!)!;
      const [toRow, toCol] = notationToIndices(position)!;

      const newBoard = [...board.map(row => [...row])];
      const movedPiece = { 
        ...selectedPiece.piece, 
        position,
        hasMoved: true 
      };
      newBoard[fromRow][fromCol] = null;
      newBoard[toRow][toCol] = movedPiece;

      // Pawn promotion
      if (movedPiece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
        newBoard[toRow][toCol] = {
          ...movedPiece,
          type: 'queen'
        };
      }

      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      setSelectedPiece({ piece: null, position: null });
      setValidMoves([]);
    }
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((piece, colIndex) => {
          const position = indicesToNotation(rowIndex, colIndex);
          const isValidMove = validMoves.includes(position);
          const isSelected = selectedPiece.position === position;
          const isLightSquare = (rowIndex + colIndex) % 2 === 0;
  
          return (
            <div
              key={position}
              className={`
                w-16 h-16 flex items-center justify-center
                ${isLightSquare ? 'bg-yellow-200' : 'bg-yellow-800'}
                ${isSelected ? 'border-4 border-green-500' : ''}
                ${isValidMove ? (isLightSquare ? 'bg-green-300' : 'bg-green-700') : ''}
                relative
                cursor-pointer
                transition-colors duration-100
              `}
              onClick={() => handleSquareClick(position)}
            >
              {piece && (
                <span className={`
                  text-4xl font-chess
                  ${piece.color === 'white' ? 
                    'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]' : 
                    'text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'}
                  ${isSelected ? 'ring-2 ring-yellow-400' : ''}
                  select-none
                `}>
                  {pieceSymbols[piece.type][piece.color]}
                </span>
              )}
              {isValidMove && !piece && (
                <div className={`absolute w-4 h-4 rounded-full opacity-80 ${isLightSquare ? 'bg-green-600' : 'bg-green-300'}`}></div>
              )}
              {colIndex === 0 && (
                <span className={`absolute left-1 top-0 text-xs font-bold ${isLightSquare ? 'text-yellow-800' : 'text-yellow-200'}`}>
                  {8 - rowIndex}
                </span>
              )}
              {rowIndex === 7 && (
                <span className={`absolute right-1 bottom-0 text-xs font-bold ${isLightSquare ? 'text-yellow-800' : 'text-yellow-200'}`}>
                  {String.fromCharCode(97 + colIndex)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    ));
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
        <h1 className="text-3xl font-bold mb-6">Chess</h1>
        
        <div className="mb-4 flex items-center gap-4">
          <div className={`
            w-8 h-8 rounded-full 
            ${currentPlayer === 'white' ? 'bg-white' : 'bg-black'}
            border-2 ${currentPlayer === 'white' ? 'border-gray-300' : 'border-gray-700'}
            shadow-md
          `}></div>
          <span className="text-xl font-semibold">
            {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s Turn
          </span>
        </div>

        {selectedPiece.piece && (
          <div className="mb-4 bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
            Selected: {selectedPiece.piece.color} {selectedPiece.piece.type} at {selectedPiece.position}
          </div>
        )}

        <div className="border-4 border-gray-700 inline-block rounded-md shadow-xl overflow-hidden">
          {renderBoard()}
        </div>

        <Button 
          onClick={resetGame}
          variant="outline"
          className="mt-6 px-6 py-2 text-lg"
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