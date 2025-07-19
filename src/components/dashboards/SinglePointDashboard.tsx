import React, { useState } from 'react';
import { Minimize2 } from 'lucide-react';
import { RawAoaGraph, ImprovedAoaGraph } from '../charts/AoaGraphs';

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
