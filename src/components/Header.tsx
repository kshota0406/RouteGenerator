import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 py-2 bg-gray-900 shadow-lg">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 animate-hologram text-center">
          Route Generator
        </h1>
      </div>
    </header>
  );
};

export default Header; 