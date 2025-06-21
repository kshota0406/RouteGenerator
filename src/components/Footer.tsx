import React from 'react';
import GoogleCredit from './GoogleCredit';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 py-1 bg-gray-900 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="max-w-2xl mx-auto px-4">
        <GoogleCredit />
      </div>
    </footer>
  );
};

export default Footer; 