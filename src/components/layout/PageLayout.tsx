// src/components/layout/PageLayout.tsx
import React, { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, className }) => {
  return (
    <div 
      className={`
        min-h-screen 
        bg-gradient-to-br 
        from-[hsla(263,70%,95%,0.1)] 
        to-[hsla(240,100%,97%,0.1)] 
        flex 
        flex-col 
        items-center 
        justify-center 
        p-4 
        antialiased 
        ${className}
      `}
    >
      <div className="w-full max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};