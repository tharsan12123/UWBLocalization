import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

// Graph components
const GraphComponent: React.FC<{ 
  title: string;
  description: string;
  onFullScreen: () => void; 
  isFullScreen: boolean 
}> = ({ 
  title,
  description,
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
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {(isHovered || isFullScreen) && (
          <button 
            onClick={onFullScreen}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        )}
      </div>
      
      <div className={`${isFullScreen ? 'h-[70vh]' : 'h-60'} bg-gray-50 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-gray-500 mb-2">{title} Placeholder</p>
          <p className="text-sm text-gray-400">{description}</p>
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
  description: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, description, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
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

export const MultiPointDashboard: React.FC = () => {
  const [fullScreenGraph, setFullScreenGraph] = useState<null | 'rawTdoa' | 'tdoaKalman' | 'tdoaMl' | 'comparison'>(null);
  
  const closeFullScreen = () => setFullScreenGraph(null);
  
  const graphs = [
    {
      id: 'rawTdoa',
      title: 'Raw TDOA',
      description: 'Time Difference of Arrival raw measurements from multiple anchors'
    },
    {
      id: 'tdoaKalman',
      title: 'TDOA with Kalman',
      description: 'TDOA data filtered using Kalman filter for improved accuracy'
    },
    {
      id: 'tdoaMl',
      title: 'TDOA with ML',
      description: 'TDOA data enhanced with machine learning algorithms'
    },
    {
      id: 'comparison',
      title: 'Comparison Graph',
      description: 'Comparative analysis of all three TDOA approaches'
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Multi Point Localization</h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-sm text-gray-700">
            This dashboard visualizes multi-point positioning data using Time Difference of Arrival (TDOA) technology.
            Compare raw TDOA data, Kalman filter enhanced data, machine learning enhanced data, and see a side-by-side 
            comparison of all three approaches. Hover over any graph and click the maximize button to view in full screen mode.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {graphs.map(graph => (
          <GraphComponent
            key={graph.id}
            title={graph.title}
            description={graph.description}
            onFullScreen={() => setFullScreenGraph(graph.id as any)}
            isFullScreen={false}
          />
        ))}
      </div>
      
      {/* Full Screen Modals */}
      {graphs.map(graph => (
        <FullScreenModal
          key={graph.id}
          isOpen={fullScreenGraph === graph.id}
          onClose={closeFullScreen}
          title={graph.title}
          description={graph.description}
        >
          <GraphComponent
            title={graph.title}
            description={graph.description}
            onFullScreen={closeFullScreen}
            isFullScreen={true}
          />
        </FullScreenModal>
      ))}
    </div>
  );
};
