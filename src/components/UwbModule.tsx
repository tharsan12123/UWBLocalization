import React from 'react';
import { Radio, Wifi } from 'lucide-react';

interface UwbModuleProps {
  id: string;
  type: 'initiator' | 'responder';
  position: { x: number; y: number };
  isActive: boolean;
}

export const UwbModule: React.FC<UwbModuleProps> = ({ id, type, position, isActive }) => {
  return (
    <div className="relative flex flex-col items-center">
      <div className={`
        relative w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300
        ${type === 'initiator' 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-green-600 hover:bg-green-700'
        }
        ${isActive ? 'shadow-lg ring-4 ring-opacity-50' : 'shadow-md'}
        ${isActive && type === 'initiator' ? 'ring-blue-300' : ''}
        ${isActive && type === 'responder' ? 'ring-green-300' : ''}
      `}>
        {isActive && (
          <div className={`
            absolute inset-0 rounded-lg animate-pulse
            ${type === 'initiator' ? 'bg-blue-400' : 'bg-green-400'}
            opacity-30
          `} />
        )}
        
        <div className="relative z-10">
          {type === 'initiator' ? (
            <Radio className="h-8 w-8 text-white" />
          ) : (
            <Wifi className="h-8 w-8 text-white" />
          )}
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <p className="text-sm font-medium text-gray-900">{id}</p>
        <p className="text-xs text-gray-500 capitalize">{type}</p>
      </div>
    </div>
  );
};