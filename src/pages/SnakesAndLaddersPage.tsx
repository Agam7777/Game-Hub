import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import {useNavigate} from 'react-router-dom';
import { Button } from '../components/ui/button';

// Snakes and Ladders board configurations
const SNAKES_AND_LADDERS: { [key: number]: number } = {
  16: 6,   // Snake
  47: 26,  // Snake
  49: 11,  // Snake
  56: 53,  // Snake
  62: 19,  // Snake
  64: 60,  // Snake
  87: 24,  // Snake
  93: 73,  // Snake
  95: 75,  // Snake
  98: 78,  // Snake

  1: 38,   // Ladder
  4: 14,   // Ladder
  9: 31,   // Ladder
  21: 42,  // Ladder
  28: 84,  // Ladder
  36: 44,  // Ladder
  51: 67,  // Ladder
  71: 91,  // Ladder
  80: 100  // Ladder to winning square
};

// Function to check if a number is a snake or ladder
const isSnake = (position: number) => {
  return SNAKES_AND_LADDERS[position] !== undefined && SNAKES_AND_LADDERS[position] < position;
};

const isLadder = (position: number) => {
  return SNAKES_AND_LADDERS[position] !== undefined && SNAKES_AND_LADDERS[position] > position;
};

export const SnakesAndLaddersPage: React.FC = () => {
  const [playerPosition, setPlayerPosition] = useState(1);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState('Roll the dice to start!');
  const [isRolling, setIsRolling] = useState(false);
  const [movementHistory, setMovementHistory] = useState<string[]>([]);
  const navigate = useNavigate();
  const [showExitDialog, setShowExitDialog] = useState(false);

  const rollDice = () => {
    if (gameOver || isRolling) return;

    setIsRolling(true);
    
    // Simulate dice roll animation
    const rollAnimation = setInterval(() => {
      setDiceRoll(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    // Stop animation after a delay
    setTimeout(() => {
      clearInterval(rollAnimation);
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceRoll(roll);
      
      // Calculate new position
      let newPosition = playerPosition + roll;
      let message = `Rolled a ${roll}. Moved from ${playerPosition} to ${newPosition}.`;
      
      // Check for snakes and ladders
      if (SNAKES_AND_LADDERS[newPosition]) {
        const isSnakeMove = SNAKES_AND_LADDERS[newPosition] < newPosition;
        const elementType = isSnakeMove ? 'snake' : 'ladder';
        message += ` Hit a ${elementType}! Moved from ${newPosition} to ${SNAKES_AND_LADDERS[newPosition]}.`;
        newPosition = SNAKES_AND_LADDERS[newPosition];
      }
      
      // Ensure position doesn't go beyond 100
      newPosition = Math.min(newPosition, 100);
      setPlayerPosition(newPosition);
      setGameMessage(message);
      setMovementHistory(prev => [message, ...prev].slice(0, 5));
      
      // Check for win condition
      if (newPosition === 100) {
        setGameOver(true);
        setGameMessage('Congratulations! You won!');
      }
      
      setIsRolling(false);
    }, 800);
  };

  const resetGame = () => {
    setPlayerPosition(1);
    setDiceRoll(null);
    setGameOver(false);
    setGameMessage('Roll the dice to start!');
    setMovementHistory([]);
  };

  // Generate board squares (10x10 grid)
  const renderBoard = () => {
    const squares = [];
    const size = 10;
    
    for (let row = size - 1; row >= 0; row--) {
      const rowSquares = [];
      
      for (let col = 0; col < size; col++) {
        // Calculate square number based on the zigzag pattern
        let squareNumber;
        if (row % 2 === 0) { // Even rows go left to right
          squareNumber = row * size + col + 1;
        } else { // Odd rows go right to left
          squareNumber = row * size + (size - col);
        }
        
        // Determine if this square has the player token
        const hasPlayer = squareNumber === playerPosition;
        
        // Determine square type (snake head, ladder start, etc.)
        const isSnakeHead = isSnake(squareNumber);
        const isLadderBase = isLadder(squareNumber);
        const isLastSquare = squareNumber === 100;
        
        // Create square element
        rowSquares.push(
          <div 
            key={squareNumber}
            className={`
              w-full aspect-square border border-gray-300 relative flex items-center justify-center
              ${squareNumber % 2 === 0 ? 'bg-blue-100' : 'bg-yellow-50'}
              ${isSnakeHead ? 'bg-red-100' : ''}
              ${isLadderBase ? 'bg-green-100' : ''}
              ${isLastSquare ? 'bg-purple-200' : ''}
            `}
          >
            <span className="text-xs sm:text-sm md:text-base font-bold">{squareNumber}</span>
            
            {isSnakeHead && <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="text-red-500 text-2xl">🐍</div>
            </div>}
            
            {isLadderBase && <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="text-green-500 text-2xl">🪜</div>
            </div>}
            
            {hasPlayer && <div className="absolute w-3/4 h-3/4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center animate-pulse">
              <span className="text-white text-xs">😀</span>
            </div>}
          </div>
        );
      }
      
      squares.push(
        <div key={`row-${row}`} className="grid grid-cols-10 w-full">
          {rowSquares}
        </div>
      );
    }
    
    return squares;
  };

  // Render dice based on current roll
  const renderDice = () => {
    if (diceRoll === null) return null;
    
    const dotPositions = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
    };
    
    const getDotPosition = (position: string) => {
      switch(position) {
        case 'top-left': return 'top-2 left-2';
        case 'top-right': return 'top-2 right-2';
        case 'middle-left': return 'top-1/2 left-2 -translate-y-1/2';
        case 'middle-right': return 'top-1/2 right-2 -translate-y-1/2';
        case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
        case 'bottom-left': return 'bottom-2 left-2';
        case 'bottom-right': return 'bottom-2 right-2';
        default: return '';
      }
    };
    
    const positions = dotPositions[diceRoll as keyof typeof dotPositions] || [];
    
    return (
      <div className={`w-20 h-20 bg-white rounded-lg shadow-md relative ${isRolling ? 'animate-bounce' : ''}`}>
        {positions.map((position, index) => (
          <div 
            key={index} 
            className={`absolute w-3 h-3 bg-black rounded-full ${getDotPosition(position)}`}
          />
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
        <h1 className="text-3xl font-bold mb-6">Snakes and Ladders</h1>
        
        <div className="w-full max-w-2xl rounded-lg bg-gradient-to-r from-amber-100 to-yellow-50 p-4 shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4">
                <p className="text-lg font-bold">Player Position: {playerPosition}</p>
                <p className="text-sm text-gray-700">{gameMessage}</p>
              </div>
              
              <div className="mb-4">
                {renderDice()}
              </div>
              
              <div className="space-x-4">
                <Button 
                  onClick={rollDice}
                  disabled={gameOver || isRolling}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isRolling ? 'Rolling...' : 'Roll Dice'}
                </Button>
                
                {gameOver && (
                  <Button 
                    onClick={resetGame}
                    variant="outline"
                  >
                    Play Again
                  </Button>
                )}
              </div>
            </div>
            
            <div className="bg-white bg-opacity-70 rounded p-2 h-full">
              <h3 className="font-bold mb-2">Game Log:</h3>
              <div className="text-xs space-y-1">
                {movementHistory.length === 0 && <p>No moves yet.</p>}
                {movementHistory.map((move, index) => (
                  <p key={index}>{move}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-2xl aspect-square bg-amber-50 border-4 border-amber-800 rounded-lg shadow-xl overflow-hidden">
          {renderBoard()}
        </div>
        
        <div className="mt-4 p-4 bg-amber-50 bg-opacity-70 rounded w-full max-w-2xl">
          <h3 className="font-bold">How to Play:</h3>
          <ul className="text-sm list-disc list-inside">
            <li>Click "Roll Dice" to move your token</li>
            <li>Land on a ladder (🪜) to climb up</li>
            <li>Land on a snake (🐍) to slide down</li>
            <li>Reach square 100 exactly to win</li>
          </ul>
        </div>
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

export default SnakesAndLaddersPage;