'use client';

import { X } from 'lucide-react';

interface ModalBaseProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ModalBase: React.FC<ModalBaseProps> = ({ onClose, title, children }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">{title}</h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ModalBase; 