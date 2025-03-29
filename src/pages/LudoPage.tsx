// src/pages/LudoPage.tsx
import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import './LudoPage.css';

type Color = 'red' | 'green' | 'blue' | 'yellow';

interface Piece {
  id: number;
  position: number;
  inHome: boolean;
  inFinish: boolean;
  homePosition?: { row: number; col: number };
}

interface Player {
  color: Color;
  pieces: Piece[];
}

export const LudoPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([
    {
      color: 'red',
      pieces: Array(4).fill(null).map((_, i) => ({ 
        id: i, 
        position: -1, 
        inHome: true, 
        inFinish: false,
        homePosition: { row: i % 2, col: Math.floor(i / 2) }
      })),
    },
    {
      color: 'green',
      pieces: Array(4).fill(null).map((_, i) => ({ 
        id: i, 
        position: -1, 
        inHome: true, 
        inFinish: false,
        homePosition: { row: i % 2, col: Math.floor(i / 2) }
      })),
    },
    {
      color: 'yellow',
      pieces: Array(4).fill(null).map((_, i) => ({ 
        id: i, 
        position: -1, 
        inHome: true, 
        inFinish: false,
        homePosition: { row: i % 2, col: Math.floor(i / 2) }
      })),
    },
    {
      color: 'blue',
      pieces: Array(4).fill(null).map((_, i) => ({ 
        id: i, 
        position: -1, 
        inHome: true, 
        inFinish: false,
        homePosition: { row: i % 2, col: Math.floor(i / 2) }
      })),
    },
  ]);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [gameMessage, setGameMessage] = useState('Roll the dice to start');
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<Color | null>(null);
  const navigate = useNavigate();
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Define path positions for each color
  const pathPositions: Record<Color, { row: number; col: number }[]> = {
    red: [
      { row: 6, col: 1 }, { row: 6, col: 2 }, { row: 6, col: 3 }, { row: 6, col: 4 }, { row: 6, col: 5 }, 
      { row: 5, col: 6 }, { row: 4, col: 6 }, { row: 3, col: 6 }, { row: 2, col: 6 }, { row: 1, col: 6 }, 
      { row: 0, col: 7 }, { row: 0, col: 8 }, { row: 1, col: 8 }, { row: 2, col: 8 }, { row: 3, col: 8 }, 
      { row: 4, col: 8 }, { row: 5, col: 8 }, { row: 6, col: 9 }, { row: 6, col: 10 }, { row: 6, col: 11 }, 
      { row: 6, col: 12 }, { row: 6, col: 13 }, { row: 7, col: 14 }, { row: 8, col: 14 }, { row: 8, col: 13 }, 
      { row: 8, col: 12 }, { row: 8, col: 11 }, { row: 8, col: 10 }, { row: 8, col: 9 }, { row: 9, col: 8 }, 
      { row: 10, col: 8 }, { row: 11, col: 8 }, { row: 12, col: 8 }, { row: 13, col: 8 }, { row: 14, col: 7 }, 
      { row: 14, col: 6 }, { row: 13, col: 6 }, { row: 12, col: 6 }, { row: 11, col: 6 }, { row: 10, col: 6 }, 
      { row: 9, col: 6 }, { row: 8, col: 5 }, { row: 8, col: 4 }, { row: 8, col: 3 }, { row: 8, col: 2 }, 
      { row: 8, col: 1 }, { row: 7, col: 0 }, { row: 6, col: 0 }, { row: 7, col: 1 }, { row: 7, col: 2 }, 
      { row: 7, col: 3 }, { row: 7, col: 4 }, { row: 7, col: 5 }, { row: 7, col: 6 }
    ],
    green: [
      { row: 1, col: 8 }, { row: 2, col: 8 }, { row: 3, col: 8 }, { row: 4, col: 8 }, { row: 5, col: 8 }, 
      { row: 6, col: 9 }, { row: 6, col: 10 }, { row: 6, col: 11 }, { row: 6, col: 12 }, { row: 6, col: 13 }, 
      { row: 7, col: 14 }, { row: 8, col: 14 }, { row: 8, col: 13 }, { row: 8, col: 12 }, { row: 8, col: 11 }, 
      { row: 8, col: 10 }, { row: 8, col: 9 }, { row: 9, col: 8 }, { row: 10, col: 8 }, { row: 11, col: 8 }, 
      { row: 12, col: 8 }, { row: 13, col: 8 }, { row: 14, col: 7 }, { row: 14, col: 6 }, { row: 13, col: 6 }, 
      { row: 12, col: 6 }, { row: 11, col: 6 }, { row: 10, col: 6 }, { row: 9, col: 6 }, { row: 8, col: 5 }, 
      { row: 8, col: 4 }, { row: 8, col: 3 }, { row: 8, col: 2 }, { row: 8, col: 1 }, { row: 7, col: 0 }, 
      { row: 6, col: 0 }, { row: 6, col: 1 }, { row: 6, col: 2 }, { row: 6, col: 3 }, { row: 6, col: 4 }, 
      { row: 6, col: 5 }, { row: 5, col: 6 }, { row: 4, col: 6 }, { row: 3, col: 6 }, { row: 2, col: 6 }, 
      { row: 1, col: 6 }, { row: 0, col: 7 }, { row: 0, col: 8 }, { row: 1, col: 7 }, { row: 2, col: 7 }, 
      { row: 3, col: 7 }, { row: 4, col: 7 }, { row: 5, col: 7 }, { row: 6, col: 7 }
    ],
    yellow: [
      { row: 8, col: 13 }, { row: 8, col: 12 }, { row: 8, col: 11 }, { row: 8, col: 10 }, { row: 8, col: 9 }, 
      { row: 9, col: 8 }, { row: 10, col: 8 }, { row: 11, col: 8 }, { row: 12, col: 8 }, { row: 13, col: 8 }, 
      { row: 14, col: 7 }, { row: 14, col: 6 }, { row: 13, col: 6 }, { row: 12, col: 6 }, { row: 11, col: 6 }, 
      { row: 10, col: 6 }, { row: 9, col: 6 }, { row: 8, col: 5 }, { row: 8, col: 4 }, { row: 8, col: 3 }, 
      { row: 8, col: 2 }, { row: 8, col: 1 }, { row: 7, col: 0 }, { row: 6, col: 0 }, { row: 6, col: 1 }, 
      { row: 6, col: 2 }, { row: 6, col: 3 }, { row: 6, col: 4 }, { row: 6, col: 5 }, { row: 5, col: 6 }, 
      { row: 4, col: 6 }, { row: 3, col: 6 }, { row: 2, col: 6 }, { row: 1, col: 6 }, { row: 0, col: 7 }, 
      { row: 0, col: 8 }, { row: 1, col: 8 }, { row: 2, col: 8 }, { row: 3, col: 8 }, { row: 4, col: 8 }, 
      { row: 5, col: 8 }, { row: 6, col: 9 }, { row: 6, col: 10 }, { row: 6, col: 11 }, { row: 6, col: 12 }, 
      { row: 6, col: 13 }, { row: 7, col: 14 }, { row: 8, col: 14 }, { row: 7, col: 13 }, { row: 7, col: 12 }, 
      { row: 7, col: 11 }, { row: 7, col: 10 }, { row: 7, col: 9 }, { row: 7, col: 8 }
    ],
    blue: [
      { row: 13, col: 6 }, { row: 12, col: 6 }, { row: 11, col: 6 }, { row: 10, col: 6 }, { row: 9, col: 6 }, 
      { row: 8, col: 5 }, { row: 8, col: 4 }, { row: 8, col: 3 }, { row: 8, col: 2 }, { row: 8, col: 1 }, 
      { row: 7, col: 0 }, { row: 6, col: 0 }, { row: 6, col: 1 }, { row: 6, col: 2 }, { row: 6, col: 3 }, 
      { row: 6, col: 4 }, { row: 6, col: 5 }, { row: 5, col: 6 }, { row: 4, col: 6 }, { row: 3, col: 6 }, 
      { row: 2, col: 6 }, { row: 1, col: 6 }, { row: 0, col: 7 }, { row: 0, col: 8 }, { row: 1, col: 8 }, 
      { row: 2, col: 8 }, { row: 3, col: 8 }, { row: 4, col: 8 }, { row: 5, col: 8 }, { row: 6, col: 9 }, 
      { row: 6, col: 10 }, { row: 6, col: 11 }, { row: 6, col: 12 }, { row: 6, col: 13 }, { row: 7, col: 14 }, 
      { row: 8, col: 14 }, { row: 8, col: 13 }, { row: 8, col: 12 }, { row: 8, col: 11 }, { row: 8, col: 10 }, 
      { row: 8, col: 9 }, { row: 9, col: 8 }, { row: 10, col: 8 }, { row: 11, col: 8 }, { row: 12, col: 8 }, 
      { row: 13, col: 8 }, { row: 14, col: 7 }, { row: 14, col: 6 }, { row: 13, col: 7 }, { row: 12, col: 7 }, 
      { row: 11, col: 7 }, { row: 10, col: 7 }, { row: 9, col: 7 }, { row: 8, col: 7 }
    ]
  };

  // Define final paths (home stretch) for each color
  const finalPaths: Record<Color, { row: number; col: number }[]> = {
    red: [
      { row: 7, col: 1 }, { row: 7, col: 2 }, { row: 7, col: 3 }, { row: 7, col: 4 }, { row: 7, col: 5 }, { row: 7, col: 6 }
    ],
    green: [
      { row: 1, col: 7 }, { row: 2, col: 7 }, { row: 3, col: 7 }, { row: 4, col: 7 }, { row: 5, col: 7 }, { row: 6, col: 7 }
    ],
    yellow: [
      { row: 7, col: 13 }, { row: 7, col: 12 }, { row: 7, col: 11 }, { row: 7, col: 10 }, { row: 7, col: 9 }, { row: 7, col: 8 }
    ],
    blue: [
      { row: 13, col: 7 }, { row: 12, col: 7 }, { row: 11, col: 7 }, { row: 10, col: 7 }, { row: 9, col: 7 }, { row: 8, col: 7 }
    ]
  };

  // Define safe cells
  const safeCells = [
    { row: 2, col: 6 },   // Top left safe cell
    { row: 6, col: 2 },   // Left top safe cell
    { row: 8, col: 2 },   // Left bottom safe cell
    { row: 12, col: 6 },  // Bottom left safe cell
    { row: 12, col: 8 },  // Bottom right safe cell
    { row: 8, col: 12 },  // Right bottom safe cell
    { row: 6, col: 12 },  // Right top safe cell
    { row: 2, col: 8 }    // Top right safe cell
  ];

  // Define start cells for each color
  const startCells: Record<Color, { row: number; col: number }> = {
    red: { row: 6, col: 1 },
    green: { row: 1, col: 8 },
    yellow: { row: 8, col: 13 },
    blue: { row: 13, col: 6 }
  };

  // Define home areas
  const homeAreas: Record<Color, { top: number; left: number }> = {
    red: { top: 0, left: 0 },
    green: { top: 0, left: 9 },
    yellow: { top: 9, left: 9 },
    blue: { top: 9, left: 0 }
  };

  const rollDice = () => {
    if (winner) return;
    
    setIsRolling(true);
    
    // Simulate rolling animation
    const rollInterval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 6) + 1;
      setDiceRoll(tempRoll);
    }, 100);
    
    // Stop after 1 second with final result
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalRoll = Math.floor(Math.random() * 6) + 1;
      setDiceRoll(finalRoll);
      setIsRolling(false);
      setGameMessage(`${players[currentPlayerIndex].color.toUpperCase()} rolled a ${finalRoll}`);
    }, 1000);
  };

  const movePiece = (playerIndex: number, pieceIndex: number) => {
    if (winner || diceRoll === null) {
      setGameMessage(winner ? 'Game already has a winner!' : 'Roll the dice first!');
      return;
    }

    const player = players[playerIndex];
    const piece = player.pieces[pieceIndex];

    // Make a copy of the players array
    const newPlayers = [...players];

    if (piece.inHome && diceRoll === 6) {
      // Move out of home
      newPlayers[playerIndex].pieces[pieceIndex] = {
        ...piece,
        inHome: false,
        position: 0,
      };
      setPlayers(newPlayers);
      setGameMessage(`Piece moved out of home! ${player.color.toUpperCase()} can roll again`);
      setDiceRoll(null);
    } else if (!piece.inHome && !piece.inFinish) {
      const newPosition = piece.position + diceRoll;
      
      if (newPosition >= 51) { // Enter final path
        const finalPathPosition = newPosition - 51;
        
        if (finalPathPosition >= 6) {
          // Reached the center - game won for this piece
          newPlayers[playerIndex].pieces[pieceIndex] = {
            ...piece,
            inFinish: true,
            position: 57, // Beyond final path
          };
          setGameMessage(`Piece reached home! ${player.color.toUpperCase()} can roll again`);
        } else {
          // In the final path
          newPlayers[playerIndex].pieces[pieceIndex] = {
            ...piece,
            position: newPosition,
          };
          setGameMessage(`Piece moved to final path. Next player's turn`);
          setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        }
      } else {
        // Normal movement on the board
        newPlayers[playerIndex].pieces[pieceIndex] = {
          ...piece,
          position: newPosition,
        };
        
        // Check if we landed on another player's piece
        const currentPosition = pathPositions[player.color][newPosition];
        let capturedPiece = false;
        
        newPlayers.forEach((otherPlayer, otherPlayerIndex) => {
          if (otherPlayerIndex !== playerIndex) { // Not current player
            otherPlayer.pieces.forEach((otherPiece, otherPieceIndex) => {
              if (!otherPiece.inHome && !otherPiece.inFinish) {
                const otherPiecePosition = pathPositions[otherPlayer.color][otherPiece.position];
                
                // Check if positions match
                if (otherPiecePosition.row === currentPosition.row && 
                    otherPiecePosition.col === currentPosition.col) {
                    
                  // Check if it's not a safe cell
                  const isSafeCell = safeCells.some(
                    cell => cell.row === currentPosition.row && cell.col === currentPosition.col
                  );
                  
                  if (!isSafeCell) {
                    // Send the other piece home
                    newPlayers[otherPlayerIndex].pieces[otherPieceIndex] = {
                      ...otherPiece,
                      inHome: true,
                      position: -1,
                    };
                    
                    capturedPiece = true;
                  }
                }
              }
            });
          }
        });
        
        if (capturedPiece) {
          setGameMessage(`Captured a piece! ${player.color.toUpperCase()} can roll again`);
        } else {
          setGameMessage(`Piece moved. Next player's turn`);
          setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        }
      }
      
      setPlayers(newPlayers);
      setDiceRoll(null);
    } else {
      setGameMessage('Cannot move this piece. Roll a 6 to start!');
    }
  };

  // Check if a cell is a path cell for any color
  const isPathCell = (row: number, col: number) => {
    for (const color of Object.keys(pathPositions) as Color[]) {
      if (pathPositions[color].some(pos => pos.row === row && pos.col === col)) {
        return color;
      }
    }
    return null;
  };

  // Check if a cell is a final path cell for any color
  const isFinalPathCell = (row: number, col: number) => {
    for (const color of Object.keys(finalPaths) as Color[]) {
      if (finalPaths[color].some(pos => pos.row === row && pos.col === col)) {
        return color;
      }
    }
    return null;
  };

  // Check if a cell is a safe cell
  const isSafeCell = (row: number, col: number) => {
    return safeCells.some(cell => cell.row === row && cell.col === col);
  };

  // Check if a cell is a start cell for any color
  const isStartCell = (row: number, col: number) => {
    for (const color of Object.keys(startCells) as Color[]) {
      if (startCells[color].row === row && startCells[color].col === col) {
        return color;
      }
    }
    return null;
  };

  // Render pieces in a cell
  const renderPiecesInCell = (row: number, col: number) => {
    const piecesInCell: { color: Color; id: number }[] = [];
    
    // Check for pieces on the path
    players.forEach(player => {
      player.pieces.forEach(piece => {
        if (!piece.inHome && !piece.inFinish) {
          let piecePosition;
          
          if (piece.position >= 51) {
            // Piece is in final path
            const finalPathIndex = piece.position - 51;
            if (finalPathIndex < 6) {
              piecePosition = finalPaths[player.color][finalPathIndex];
            }
          } else {
            // Piece is on regular path
            piecePosition = pathPositions[player.color][piece.position];
          }
          
          if (piecePosition && piecePosition.row === row && piecePosition.col === col) {
            piecesInCell.push({ color: player.color, id: piece.id });
          }
        }
      });
    });
    
    if (piecesInCell.length === 0) return null;
    
    return (
      <div className="piece-container">
        {piecesInCell.map((piece, index) => (
          <div 
            key={`${piece.color}-${piece.id}`} 
            className={`piece piece-${piece.color}`}
            style={{
              top: `${index % 2 * 12}px`,
              left: `${Math.floor(index / 2) * 12}px`
            }}
            onClick={() => {
              const playerIndex = players.findIndex(p => p.color === piece.color);
              if (playerIndex === currentPlayerIndex) {
                movePiece(playerIndex, piece.id);
              }
            }}
          />
        ))}
      </div>
    );
  };

  // Render the board
  const renderBoard = () => {
    const board = [];
    const size = 15;
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        let cellClass = "ludo-cell";
        
        // Check if this is a home area cell (corners)
        const inRedHome = row < 6 && col < 6;
        const inGreenHome = row < 6 && col > 8;
        const inYellowHome = row > 8 && col > 8;
        const inBlueHome = row > 8 && col < 6;
        
        if (inRedHome || inGreenHome || inYellowHome || inBlueHome) {
          continue; // Skip rendering individual cells in home areas
        }
        
        // Add classes for path cells
        const pathColor = isPathCell(row, col);
        if (pathColor) {
          cellClass += ` path-${pathColor}`;
        }
        
        // Add classes for final path cells
        const finalPathColor = isFinalPathCell(row, col);
        if (finalPathColor) {
          cellClass += ` final-path-${finalPathColor}`;
        }
        
        // Add classes for safe cells
        if (isSafeCell(row, col)) {
          cellClass += " safe-cell";
        }
        
        // Add classes for start cells
        const startColor = isStartCell(row, col);
        if (startColor) {
          cellClass += ` start-cell start-${startColor}`;
        }
        
        board.push(
          <div 
            key={`cell-${row}-${col}`} 
            className={cellClass}
            style={{ gridRow: row + 1, gridColumn: col + 1 }}
          >
            {renderPiecesInCell(row, col)}
          </div>
        );
      }
    }
    
    // Add the home areas
    Object.entries(homeAreas).forEach(([color, position]) => {
      board.push(
        <div 
          key={`home-${color}`} 
          className={`home-area home-${color}`}
          style={{ 
            gridRowStart: position.top + 1, 
            gridRowEnd: position.top + 7,
            gridColumnStart: position.left + 1, 
            gridColumnEnd: position.left + 7
          }}
        >
          {players.find(p => p.color === color)?.pieces.map((piece, i) => (
            piece.inHome && (
              <div 
                key={`home-piece-${color}-${i}`}
                className={`home-circle home-circle-${color}`}
                style={{
                  gridRow: piece.homePosition?.row ? piece.homePosition.row + 1 : 1,
                  gridColumn: piece.homePosition?.col ? piece.homePosition.col + 1 : 1
                }}
                onClick={() => {
                  const playerIndex = players.findIndex(p => p.color === color as Color);
                  if (playerIndex === currentPlayerIndex) {
                    movePiece(playerIndex, i);
                  }
                }}
              />
            )
          ))}
        </div>
      );
    });
    
    // Add center area
    board.push(
      <div 
        key="center-area" 
        className="center-area"
        style={{ 
          gridRowStart: 7, 
          gridRowEnd: 9,
          gridColumnStart: 7, 
          gridColumnEnd: 9
        }}
      >
        <div className="center-triangle center-triangle-red"></div>
        <div className="center-triangle center-triangle-green"></div>
        <div className="center-triangle center-triangle-yellow"></div>
        <div className="center-triangle center-triangle-blue"></div>
      </div>
    );
    
    return board;
  };

  const renderDice = () => {
    const dotPositions = [
      [], // 0 dots (not used)
      [[50, 50]], // 1 dot
      [[25, 25], [75, 75]], // 2 dots
      [[25, 25], [50, 50], [75, 75]], // 3 dots
      [[25, 25], [25, 75], [75, 25], [75, 75]], // 4 dots
      [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]], // 5 dots
      [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]] // 6 dots
    ];
    
    if (!diceRoll) return null;
    
    return (
      <div className="dice">
        {dotPositions[diceRoll].map((pos, i) => (
          <div 
            key={i} 
            className="dice-dot"
            style={{
              position: 'absolute',
              top: `${pos[0]}%`,
              left: `${pos[1]}%`,
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#333',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>
    );
  };

  // Check if a player has won
  const hasPlayerWon = (playerIndex: number) => {
    return players[playerIndex].pieces.every(piece => piece.inFinish);
  };

  // Check if the game has a winner
  useEffect(() => {
    players.forEach((player, index) => {
      if (hasPlayerWon(index)) {
        setWinner(player.color);
        setGameMessage(`${player.color.toUpperCase()} has won the game!`);
      }
    });
  }, [players]);

  const resetGame = () => {
    setPlayers([
      {
        color: 'red',
        pieces: Array(4).fill(null).map((_, i) => ({ 
          id: i, 
          position: -1, 
          inHome: true, 
          inFinish: false,
          homePosition: { row: i % 2, col: Math.floor(i / 2) }
        })),
      },
      {
        color: 'green',
        pieces: Array(4).fill(null).map((_, i) => ({ 
          id: i, 
          position: -1, 
          inHome: true, 
          inFinish: false,
          homePosition: { row: i % 2, col: Math.floor(i / 2) }
        })),
      },
      {
        color: 'yellow',
        pieces: Array(4).fill(null).map((_, i) => ({ 
          id: i, 
          position: -1, 
          inHome: true, 
          inFinish: false,
          homePosition: { row: i % 2, col: Math.floor(i / 2) }
        })),
      },
      {
        color: 'blue',
        pieces: Array(4).fill(null).map((_, i) => ({ 
          id: i, 
          position: -1, 
          inHome: true, 
          inFinish: false,
          homePosition: { row: i % 2, col: Math.floor(i / 2) }
        })),
      },
    ]);
    setCurrentPlayerIndex(0);
    setDiceRoll(null);
    setGameMessage('Roll the dice to start');
    setWinner(null);
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
      <div className="flex flex-col items-center p-4">
        {/* Home Button */}
          <Button 
            onClick={handleExitToHome}
            variant="ghost"
            className="absolute left-5 top-5 text-2xl p-5"
          >
            ← Home
          </Button>
        <h1 className="text-3xl font-bold mb-6">Ludo Game</h1>

        <div className="mb-4 text-xl">
          Current Player: <span style={{ 
            color: players[currentPlayerIndex].color, 
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {players[currentPlayerIndex].color}
          </span>
        </div>

        <div className="mb-4 text-lg font-medium">
          {gameMessage}
        </div>

        <div className="mb-4">
          {renderDice() || (
            <Button 
              onClick={rollDice} 
              disabled={isRolling || winner !== null}
              className="px-6 py-3 text-lg"
            >
              {isRolling ? 'Rolling...' : 'Roll Dice'}
            </Button>
          )}
        </div>

        <div className="ludo-board mb-6">
          {renderBoard()}
        </div>

        <div className="flex gap-4 mb-6">
          {players.map((player, playerIndex) => (
            <div
              key={player.color}
              className={`player-controls player-controls-${player.color} p-3 rounded-lg`}
            >
              <h2 className="text-lg font-bold mb-2 capitalize">{player.color} Player</h2>
              <div className="flex gap-2">
                {player.pieces.map((piece, pieceIndex) => (
                  <div
                    key={piece.id}
                    className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
                      ${piece.inHome ? 'opacity-50' : ''}
                      ${piece.inFinish ? 'bg-green-500' : `bg-${player.color}-500`}
                      ${playerIndex === currentPlayerIndex && !isRolling && diceRoll !== null ? 
                        'ring-2 ring-black' : ''}
                      text-white font-bold text-sm`}
                    onClick={() => {
                      if (playerIndex === currentPlayerIndex) {
                        movePiece(playerIndex, pieceIndex);
                      }
                    }}
                  >
                    {piece.inHome ? 'H' : piece.inFinish ? 'F' : piece.position}
                  </div>
                ))}
              </div>
            </div>
          ))}
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