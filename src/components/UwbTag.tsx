import React from 'react';
import { MapPin } from 'lucide-react';

interface UwbTagProps {
  id: string;
  position: { x: number; y: number };
  isActive: boolean;
  color?: string;
  opacity?: string;
}

export const UwbTag: React.FC<UwbTagProps> = ({ 
  id, 
  position, 
  isActive, 
  color = 'bg-orange-600',
  opacity = 'opacity-100'
}) => {
  return (
    <div 
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${opacity}`}
      style={{ left: position.x, top: position.y }}
    >
      <div className={`
        relative w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300
        ${color}
        ${isActive ? 'shadow-lg ring-3 ring-opacity-50 ring-orange-300' : 'shadow-md'}
      `}>
        {isActive && (
          <div className={`
            absolute inset-0 rounded-full animate-pulse
            ${color}
            opacity-30
          `} />
        )}
        
        <MapPin className="h-3 w-3 text-white relative z-10" />
      </div>
      
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
        <p className="text-xs font-medium text-gray-900 bg-white px-1 rounded shadow-sm">{id}</p>
      </div>
    </div>
  );
};