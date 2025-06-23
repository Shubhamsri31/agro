
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} AgroSage AI. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Powered by Google Gemini. Recommendations are for informational purposes only.
        </p>
      </div>
    </footer>
  );
};
    