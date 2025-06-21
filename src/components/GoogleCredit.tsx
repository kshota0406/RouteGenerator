import React from 'react';

const GoogleCredit: React.FC = () => {
  return (
    <div className="text-center text-gray-500">
      <p className="text-[10px] leading-tight mb-1">
        このアプリは Google Maps および Places API を使用しています。
      </p>
      <p className="text-xs">
        ©{new Date().getFullYear()} Google
      </p>
    </div>
  );
};

export default GoogleCredit; 