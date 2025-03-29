// src/components/ui/GameCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Button } from './button';
import { getGameIcon } from '../../utils/gameIcons';

interface GameCardProps {
  id: string;
  name: string;
  className?: string;
}

export const GameCard: React.FC<GameCardProps> = ({ id, name, className }) => {
  const navigate = useNavigate();

  const handleGameSelect = () => {
    navigate(`/${id}`);
  };

  return (
    <Card 
      className={`
        h-[320px]
        w-[280px] // Matches the width set in HomePage
        flex
        flex-col
        justify-between
        overflow-hidden
        group
        transform
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-xl
        ${className}
      `}
    >
      <div className="flex flex-col h-full">
        <CardHeader className="p-5 pb-0 flex flex-col items-center flex-shrink-0">
          <div className="
            w-16
            h-16
            mb-3
            rounded-full
            bg-primary/10
            flex
            items-center
            justify-center
            transition-all
            duration-300
            group-hover:bg-primary/20
            flex-shrink-0
          ">
            <div className="text-primary opacity-80 group-hover:opacity-100 transition-opacity">
              {getGameIcon(id, "w-10 h-10")}
            </div>
          </div>
          <CardTitle className="
            text-lg
            font-semibold
            text-center
            text-foreground
            group-hover:text-primary
            transition-colors
            px-2
            w-full
            h-[56px]
            flex
            items-center
            justify-center
            overflow-hidden
          ">
            <span className="line-clamp-2 leading-tight">
              {name}
            </span>
          </CardTitle>
        </CardHeader>
        <div className="flex-grow"></div> {/* Spacer */}
        <CardContent className="p-5 pt-0 w-full flex-shrink-0">
          <Button
            onClick={handleGameSelect}
            variant="default"
            className="w-full"
            size="sm"
          >
            Play Now
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};