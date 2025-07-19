import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

// Graph components
const RawAoaGraph: React.FC<{ onFullScreen: () => void; isFullScreen: boolean }> = ({ 
  onFullScreen, 
  isFullScreen 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative bg-white rounded-lg shadow-lg ${isFullScreen ? 'p-6' : 'p-4'} border border-gray-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">RAW AOA</h3>
        {(isHovered || isFullScreen) && (
          <button 
            onClick={onFullScreen}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        )}
      </div>
      
      <div className={`${isFullScreen ? 'h-[70vh]' : 'h-80'} bg-gray-50 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-gray-500 mb-2">RAW AOA Graph Placeholder</p>
          <p className="text-sm text-gray-400">Real-time angle of arrival data visualization</p>
        </div>
      </div>
    </div>
  );
};

const ImprovedAoaGraph: React.FC<{ onFullScreen: () => void; isFullScreen: boolean }> = ({ 
  onFullScreen,
  isFullScreen
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative bg-white rounded-lg shadow-lg ${isFullScreen ? 'p-6' : 'p-4'} border border-gray-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Improved AOA with ML</h3>
        {(isHovered || isFullScreen) && (
          <button 
            onClick={onFullScreen}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        )}
      </div>
      
      <div className={`${isFullScreen ? 'h-[70vh]' : 'h-80'} bg-gray-50 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-gray-500 mb-2">ML-Enhanced AOA Graph Placeholder</p>
          <p className="text-sm text-gray-400">Machine learning improved angle of arrival visualization</p>
        </div>
      </div>
    </div>
  );
};

// Full screen modal component
const FullScreenModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Minimize2 size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const SinglePointDashboard: React.FC = () => {
  const [fullScreenGraph, setFullScreenGraph] = useState<null | 'raw' | 'improved'>(null);
  
  const closeFullScreen = () => setFullScreenGraph(null);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Single Point Localization</h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-sm text-gray-700">
            This dashboard displays real-time angle of arrival (AoA) data from a single UWB tag. 
            The left graph shows raw AoA measurements, while the right graph presents ML-enhanced 
            data for improved accuracy. Hover over any graph and click the maximize button to view 
            in full screen mode.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RawAoaGraph 
          onFullScreen={() => setFullScreenGraph('raw')} 
          isFullScreen={false}
        />
        <ImprovedAoaGraph 
          onFullScreen={() => setFullScreenGraph('improved')} 
          isFullScreen={false}
        />
      </div>
      
      {/* Full Screen Modals */}
      <FullScreenModal 
        isOpen={fullScreenGraph === 'raw'} 
        onClose={closeFullScreen}
        title="RAW AOA"
      >
        <RawAoaGraph 
          onFullScreen={closeFullScreen} 
          isFullScreen={true}
        />
      </FullScreenModal>
      
      <FullScreenModal 
        isOpen={fullScreenGraph === 'improved'} 
        onClose={closeFullScreen}
        title="Improved AOA with ML"
      >
        <ImprovedAoaGraph 
          onFullScreen={closeFullScreen} 
          isFullScreen={true}
        />
      </FullScreenModal>
    </div>
  );
};
