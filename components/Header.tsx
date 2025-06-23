
import React from 'react';
import { LeafIcon } from './icons/LeafIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-primary shadow-lg">
      <div className="container mx-auto px-4 py-5 flex items-center justify-center sm:justify-start">
        <LeafIcon className="h-10 w-10 text-white mr-3" />
        <h1 className="text-3xl font-bold text-white tracking-tight">
          AgroSage AI
        </h1>
      </div>
    </header>
  );
};
    