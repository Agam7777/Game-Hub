// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GAMES } from '../constants/games';
import { PageLayout } from '../components/layout/PageLayout';
import { getGameIcon } from '../utils/gameIcons';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Game Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Explore a world of classic games at your fingertips
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-6xl">
          {GAMES.map((game) => (
            <div 
              key={game.id}
              onClick={() => navigate(`/${game.id}`)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden h-[230px] w-[220px] mx-auto flex flex-col">
                <div className="p-5 flex flex-col items-center h-full">
                  <div className="mb-3 w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center">
                    <div className="text-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      {getGameIcon(game.id, "w-8 h-8")}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors text-center h-[48px] flex items-center justify-center px-2 w-full">
                    <span className="line-clamp-2 leading-tight">
                      {game.name}
                    </span>
                  </h3>
                  <div className="flex-grow"></div>
                  <p className="text-sm text-gray-500 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-3">
                    Click to play
                  </p>
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};