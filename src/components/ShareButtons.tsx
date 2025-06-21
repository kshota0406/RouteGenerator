'use client';

import React, { useState } from 'react';
import { copyRouteUrl } from '@/lib/routeSharing';

interface ShareButtonsProps {
  className?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ className = '' }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    setIsCopied(true);
    const success = await copyRouteUrl();
    if (success) {
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      setIsCopied(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={isCopied}
      className={`w-1/2 flex items-center justify-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 ${className}`}
    >
      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      </svg>
      {isCopied ? 'コピーしました！' : '経路をシェア'}
    </button>
  );
};

export default ShareButtons; 