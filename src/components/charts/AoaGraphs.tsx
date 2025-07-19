import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Line, Scatter } from 'react-chartjs-2';
import { db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { 
  getDefaultOptions, 
  createPositionDataset, 
  createHistoryDataset,
  createAnchorDatasets
} from '../charts/ChartUtils';

interface AoaGraphProps {
  onFullScreen: () => void;
  isFullScreen: boolean;
}

// Raw AOA Graph Component
export const RawAoaGraph: React.FC<AoaGraphProps> = ({ 
  onFullScreen, 
  isFullScreen 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [history, setHistory] = useState<Array<[number, number]>>([]);
  const [angles, setAngles] = useState<{[key: string]: number}>({});
  const [anchors, setAnchors] = useState<{[key: string]: [number, number]}>({});
  
  useEffect(() => {
    const dbRef = ref(db, '/aoa');
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const raw = snapshot.val();
      if (!raw) return;
      
      const parsePair = (input: any): [number, number] => {
        if (!input) return [0, 0];
        const x = parseFloat(input[0] ?? input["0"]) || 0;
        const y = parseFloat(input[1] ?? input["1"]) || 0;
        return [x, y];
      };
      
      const newPosition = parsePair(raw.tag);
      setPosition(newPosition);
      
      // Update history (max 100 points)
      setHistory(prev => {
        const updated = [...prev, newPosition];
        return updated.length > 100 ? updated.slice(-100) : updated;
      });
      
      // Update angles
      const newAngles = {
        A1: parseFloat(raw.angles?.A1) || 0,
        A2: parseFloat(raw.angles?.A2) || 0,
        A3: parseFloat(raw.angles?.A3) || 0,
      };
      setAngles(newAngles);
      
      // Update anchors
      const newAnchors = {
        A1: parsePair(raw.anchors?.A1),
        A2: parsePair(raw.anchors?.A2),
        A3: parsePair(raw.anchors?.A3),
      };
      setAnchors(newAnchors);
    });
    
    return () => unsubscribe();
  }, []);
  
  const chartData = {
    datasets: [
      ...createAnchorDatasets(anchors),
      createHistoryDataset(history, 'Tag Path', 'rgba(255, 99, 132, 0.5)'),
      createPositionDataset(position[0], position[1], 'Current Position', 'rgba(255, 99, 132, 1)'),
    ]
  };
  
  const chartOptions = getDefaultOptions('Raw AOA Localization');
  
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
      
      <div className={`${isFullScreen ? 'h-[70vh]' : 'h-80'} bg-gray-50 rounded-lg`}>
        <Scatter data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        {Object.entries(angles).map(([anchor, angle]) => (
          <div key={anchor} className="bg-gray-100 p-2 rounded">
            <span className="font-semibold">{anchor} Angle:</span> {angle.toFixed(1)}°
          </div>
        ))}
      </div>
    </div>
  );
};

// ML-Enhanced AOA Graph Component
export const ImprovedAoaGraph: React.FC<AoaGraphProps> = ({ 
  onFullScreen,
  isFullScreen
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [rawPosition, setRawPosition] = useState<[number, number]>([0, 0]);
  const [history, setHistory] = useState<Array<[number, number]>>([]);
  const [rawHistory, setRawHistory] = useState<Array<[number, number]>>([]);
  const [anchors, setAnchors] = useState<{[key: string]: [number, number]}>({});
  
  useEffect(() => {
    const dbRef = ref(db, '/aoaML');
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const raw = snapshot.val();
      if (!raw) return;
      
      const parsePair = (input: any): [number, number] => {
        if (!input) return [0, 0];
        const x = parseFloat(input[0] ?? input["0"]) || 0;
        const y = parseFloat(input[1] ?? input["1"]) || 0;
        return [x, y];
      };
      
      const newRawPosition = parsePair(raw.tag_raw);
      const newPosition = parsePair(raw.tag_ml);
      
      setRawPosition(newRawPosition);
      setPosition(newPosition);
      
      // Update histories (max 100 points)
      setRawHistory(prev => {
        const updated = [...prev, newRawPosition];
        return updated.length > 100 ? updated.slice(-100) : updated;
      });
      
      setHistory(prev => {
        const updated = [...prev, newPosition];
        return updated.length > 100 ? updated.slice(-100) : updated;
      });
      
      // Update anchors
      const newAnchors = {
        A1: parsePair(raw.anchors?.A1),
        A2: parsePair(raw.anchors?.A2),
        A3: parsePair(raw.anchors?.A3),
      };
      setAnchors(newAnchors);
    });
    
    return () => unsubscribe();
  }, []);
  
  const chartData = {
    datasets: [
      ...createAnchorDatasets(anchors),
      createHistoryDataset(rawHistory, 'Raw Tag Path', 'rgba(255, 159, 64, 0.3)'),
      createPositionDataset(rawPosition[0], rawPosition[1], 'Raw Position', 'rgba(255, 159, 64, 0.8)'),
      createHistoryDataset(history, 'ML Tag Path', 'rgba(75, 192, 192, 0.5)'),
      createPositionDataset(position[0], position[1], 'ML Enhanced Position', 'rgba(75, 192, 192, 1)'),
    ]
  };
  
  const chartOptions = getDefaultOptions('ML-Enhanced AOA Localization');
  
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
      
      <div className={`${isFullScreen ? 'h-[70vh]' : 'h-80'} bg-gray-50 rounded-lg`}>
        <Scatter data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-100 p-2 rounded">
          <span className="font-semibold">Raw Position:</span> 
          ({rawPosition[0].toFixed(2)}, {rawPosition[1].toFixed(2)})
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <span className="font-semibold">ML Position:</span> 
          ({position[0].toFixed(2)}, {position[1].toFixed(2)})
        </div>
        <div className="bg-green-50 p-2 rounded col-span-2">
          <span className="font-semibold">Error Reduction:</span> 
          {Math.sqrt(
            Math.pow(rawPosition[0] - position[0], 2) + 
            Math.pow(rawPosition[1] - position[1], 2)
          ).toFixed(2)} meters
        </div>
      </div>
    </div>
  );
};
