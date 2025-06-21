import React from 'react';

const GoogleCredit: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <p className="text-[10px] text-gray-400">
        This app uses Google Maps & Places API.
      </p>
      <span className="text-gray-600">|</span>
      <p className="text-[10px] text-gray-400">
        ©{new Date().getFullYear()} Google
      </p>
    </div>
  );
};

export default GoogleCredit; 