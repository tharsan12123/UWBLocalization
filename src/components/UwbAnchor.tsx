import React from 'react';
import { Anchor } from 'lucide-react';

interface UwbAnchorProps {
  id: string;
  position: { x: number; y: number };
  color: string;
  isActive: boolean;
}

export const UwbAnchor: React.FC<UwbAnchorProps> = ({ id, position, color, isActive }) => {
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: position.x, top: position.y }}
    >
      <div className={`
        relative w-3 h-3 rounded-full flex items-center justify-center transition-all duration-300
        ${color}
        ${isActive ? 'shadow-lg ring-3 ring-opacity-50 ring-gray-300' : 'shadow-md'}
      `}>
        {isActive && (
          <div className={`
            absolute inset-0 rounded-full animate-ping
            ${color}
            opacity-30
          `} />
        )}
        
        <Anchor className="h-5 w-5 text-white relative z-10" />
      </div>
      
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
        <p className="text-xs font-medium text-gray-900 bg-white px-1 rounded shadow-sm">{id}</p>
      </div>
    </div>
  );
};