import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Scatter } from 'react-chartjs-2';
import { db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import useLocalizationData from '../../useLocalizationData';
import useKalmanLocalizationData from '../../useKalmanLocalizationData';
import useMLLocalizationData from '../../useMlLocalizationData';
import { UwbAnchor } from '../components/UwbAnchor'; // adjust path if needed

import { 
  getDefaultOptions, 
  createPositionDataset, 
  createHistoryDataset,
  createAnchorDatasets
} from '../charts/ChartUtils';

interface TdoaGraphProps {
  onFullScreen: () => void;
  isFullScreen: boolean;
}

// Raw TDOA Graph
export const RawTdoaGraph: React.FC<TdoaGraphProps> = ({ 
  onFullScreen, 
  isFullScreen 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [history, setHistory] = useState<Array<[number, number]>>([]);
  const localizationData = useLocalizationData();
  
  const tag = localizationData?.tag ?? [0, 0];
  const anchors = localizationData?.anchors ?? {};
  
  useEffect(() => {
    if (localizationData && localizationData.tag) {
      setHistory(prev => {
        const updated = [...prev, localizationData.tag];
        return updated.length > 100 ? updated.slice(-100) : updated;
      });
    }
  }, [localizationData]);
  
  const chartData = {
    datasets: [
      ...createAnchorDatasets(anchors),
      createHistoryDataset(history, 'TDOA Tag Path', 'rgba(255, 99, 132, 0.5)'),
      createPositionDataset(tag[0], tag[1], 'Current TDOA Position', 'rgba(255, 99, 132, 1)')
    ]
  };
  
  const chartOptions = getDefaultOptions('Raw TDOA Localization');
  
  return (
    <div 
      className={`relative bg-white rounded-lg shadow-lg ${isFullScreen ? 'p-6' : 'p-4'} border border-gray-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Raw TDOA</h3>
        {(isHovered || isFullScreen) && (
          <button 
            onClick={onFullScreen}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        )}
      </div>
      
      <div className={`${isFullScreen ? 'h-[70vh]' : 'h-60'} bg-gray-50 rounded-lg`}>
        <Scatter data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-50 p-2 rounded">
          <span className="font-semibold">X Position:</span> {tag[0].toFixed(2)} m
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <span className="font-semibold">Y Position:</span> {tag[1].toFixed(2)} m
        </div>
        <div className="bg-gray-50 p-2 rounded col-span-2">
          <span className="font-semibold">TDOA Values:</span> {' '}
          A1-A2: {localizationData?.tdoa?.tdoa12.toFixed(3) || '0.000'} ns, 
          A1-A3: {localizationData?.tdoa?.tdoa13.toFixed(3) || '0.000'} ns
        </div>
      </div>
    </div>
  );
};

// TDOA with Kalman Filter Graph
export const TdoaKalmanGraph: React.FC<TdoaGraphProps> = ({ 
  onFullScreen, 
  isFullScreen 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rawHistory, setRawHistory] = useState<Array<[number, number]>>([]);
  const [filteredHistory, setFilteredHistory] = useState<Array<[number, number]>>([]);
  const kalmanData = useKalmanLocalizationData();
  
  const rawTag = kalmanData?.tag_tdoa ?? [0, 0];
  const filteredTag = kalmanData?.tag_kalman ?? [0, 0];
  const anchors = kalmanData?.anchors ?? {};
  
  useEffect(() => {
    if (kalmanData) {
      if (kalmanData.tag_tdoa) {
        setRawHistory(prev => {
          const updated = [...prev, kalmanData.tag_tdoa];
          return updated.length > 100 ? updated.slice(-100) : updated;
        });
      }
      
      if (kalmanData.tag_kalman) {
        setFilteredHistory(prev => {
          const updated = [...prev, kalmanData.tag_kalman];
          return updated.length > 100 ? updated.slice(-100) : updated;
        });
      }
    }
  }, [kalmanData]);
  
  const chartData = {
    datasets: [
      ...createAnchorDatasets(anchors),
      createHistoryDataset(rawHistory, 'Raw TDOA Path', 'rgba(255, 159, 64, 0.3)'),
      createPositionDataset(rawTag[0], rawTag[1], 'Raw TDOA Position', 'rgba(255, 159, 64, 0.8)'),
      createHistoryDataset(filteredHistory, 'Kalman Filtered Path', 'rgba(54, 162, 235, 0.5)'),
      createPositionDataset(filteredTag[0], filteredTag[1], 'Kalman Filtered Position', 'rgba(54, 162, 235, 1)')
    ]
  };
  
  const chartOptions = getDefaultOptions('TDOA with Kalman Filter');
  
  return (
    <div 
      className={`relative bg-white rounded-lg shadow-lg ${isFullScreen ? 'p-6' : 'p-4'} border border-gray-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">TDOA with Kalman</h3>
        {(isHovered || isFullScreen) && (
          <button 
            onClick={onFullScreen}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        )}
      </div>
      
      <div className={`${isFullScreen ? 'h-[70vh]' : 'h-60'} bg-gray-50 rounded-lg`}>
        <Scatter data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-100 p-2 rounded">
          <span className="font-semibold">Raw Position:</span> 
          ({rawTag[0].toFixed(2)}, {rawTag[1].toFixed(2)})
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <span className="font-semibold">Filtered Position:</span> 
          ({filteredTag[0].toFixed(2)}, {filteredTag[1].toFixed(2)})
        </div>
        <div className="bg-blue-50 p-2 rounded col-span-2">
          <span className="font-semibold">Kalman Improvement:</span> 
          {Math.sqrt(
            Math.pow(rawTag[0] - filteredTag[0], 2) + 
            Math.pow(rawTag[1] - filteredTag[1], 2)
          ).toFixed(2)} meters
        </div>
      </div>
    </div>
  );
};

// TDOA with ML Graph
export const TdoaMlGraph: React.FC<TdoaGraphProps> = ({ 
  onFullScreen, 
  isFullScreen 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rawHistory, setRawHistory] = useState<Array<[number, number]>>([]);
  const [mlHistory, setMlHistory] = useState<Array<[number, number]>>([]);
  const mlData = useMLLocalizationData();
  
  const rawTag = mlData?.tag_tdoa ?? [0, 0];
  const mlTag = mlData?.tag_ML ?? [0, 0];
  const anchors = mlData?.anchors ?? {};
  
  useEffect(() => {
    if (mlData) {
      if (mlData.tag_tdoa) {
        setRawHistory(prev => {
          const updated = [...prev, mlData.tag_tdoa];
          return updated.length > 100 ? updated.slice(-100) : updated;
        });
      }
      
      if (mlData.tag_ML) {
        setMlHistory(prev => {
          const updated = [...prev, mlData.tag_ML];
          return updated.length > 100 ? updated.slice(-100) : updated;
        });
      }
    }
  }, [mlData]);
  
  const chartData = {
    datasets: [
      ...createAnchorDatasets(anchors),
      createHistoryDataset(rawHistory, 'Raw TDOA Path', 'rgba(255, 159, 64, 0.3)'),
      createPositionDataset(rawTag[0], rawTag[1], 'Raw TDOA Position', 'rgba(255, 159, 64, 0.8)'),
      createHistoryDataset(mlHistory, 'ML Enhanced Path', 'rgba(153, 102, 255, 0.5)'),
      createPositionDataset(mlTag[0], mlTag[1], 'ML Enhanced Position', 'rgba(153, 102, 255, 1)')
    ]
  };
  
  const chartOptions = getDefaultOptions('TDOA with Machine Learning');
  
  return (
    <div 
      className={`relative bg-white rounded-lg shadow-lg ${isFullScreen ? 'p-6' : 'p-4'} border border-gray-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">TDOA with ML</h3>
        {(isHovered || isFullScreen) && (
          <button 
            onClick={onFullScreen}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        )}
      </div>
      
      <div className={`${isFullScreen ? 'h-[70vh]' : 'h-60'} bg-gray-50 rounded-lg`}>
        <Scatter data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-100 p-2 rounded">
          <span className="font-semibold">Raw Position:</span> 
          ({rawTag[0].toFixed(2)}, {rawTag[1].toFixed(2)})
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <span className="font-semibold">ML Position:</span> 
          ({mlTag[0].toFixed(2)}, {mlTag[1].toFixed(2)})
        </div>
        <div className="bg-purple-50 p-2 rounded col-span-2">
          <span className="font-semibold">ML Improvement:</span> 
          {Math.sqrt(
            Math.pow(rawTag[0] - mlTag[0], 2) + 
            Math.pow(rawTag[1] - mlTag[1], 2)
          ).toFixed(2)} meters
        </div>
      </div>
    </div>
  );
};

// Comparison Graph
export const TdoaComparisonGraph: React.FC<TdoaGraphProps> = ({ 
  onFullScreen, 
  isFullScreen 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'raw' | 'kalman' | 'ml'>('all');
  
  // Use all three data sources
  const rawData = useLocalizationData();
  const kalmanData = useKalmanLocalizationData();
  const mlData = useMLLocalizationData();
  
  // Position data
  const rawTag = rawData?.tag ?? [0, 0];
  const kalmanTag = kalmanData?.tag_kalman ?? [0, 0];
  const mlTag = mlData?.tag_ML ?? [0, 0];
  
  // Use the first available anchors (they should be the same in all data sources)
  const anchors = rawData?.anchors ?? kalmanData?.anchors ?? mlData?.anchors ?? {};
  
  // History tracking
  const [rawHistory, setRawHistory] = useState<Array<[number, number]>>([]);
  const [kalmanHistory, setKalmanHistory] = useState<Array<[number, number]>>([]);
  const [mlHistory, setMlHistory] = useState<Array<[number, number]>>([]);
  
  // Update histories
  useEffect(() => {
    if (rawData?.tag) {
      setRawHistory(prev => {
        const updated = [...prev, rawData.tag];
        return updated.length > 100 ? updated.slice(-100) : updated;
      });
    }
    
    if (kalmanData?.tag_kalman) {
      setKalmanHistory(prev => {
        const updated = [...prev, kalmanData.tag_kalman];
        return updated.length > 100 ? updated.slice(-100) : updated;
      });
    }
    
    if (mlData?.tag_ML) {
      setMlHistory(prev => {
        const updated = [...prev, mlData.tag_ML];
        return updated.length > 100 ? updated.slice(-100) : updated;
      });
    }
  }, [rawData, kalmanData, mlData]);
  
  // Prepare datasets based on selected method
  const getDatasets = () => {
    const datasets = [...createAnchorDatasets(anchors)];
    
    if (selectedMethod === 'all' || selectedMethod === 'raw') {
      datasets.push(
        createHistoryDataset(rawHistory, 'Raw TDOA Path', 'rgba(255, 99, 132, 0.5)'),
        createPositionDataset(rawTag[0], rawTag[1], 'Raw TDOA Position', 'rgba(255, 99, 132, 1)')
      );
    }
    
    if (selectedMethod === 'all' || selectedMethod === 'kalman') {
      datasets.push(
        createHistoryDataset(kalmanHistory, 'Kalman Path', 'rgba(54, 162, 235, 0.5)'),
        createPositionDataset(kalmanTag[0], kalmanTag[1], 'Kalman Position', 'rgba(54, 162, 235, 1)')
      );
    }
    
    if (selectedMethod === 'all' || selectedMethod === 'ml') {
      datasets.push(
        createHistoryDataset(mlHistory, 'ML Path', 'rgba(153, 102, 255, 0.5)'),
        createPositionDataset(mlTag[0], mlTag[1], 'ML Position', 'rgba(153, 102, 255, 1)')
      );
    }
    
    return datasets;
  };
  
  const chartData = { datasets: getDatasets() };
  const chartOptions = getDefaultOptions('TDOA Methods Comparison');
  
  return (
    <div 
      className={`relative bg-white rounded-lg shadow-lg ${isFullScreen ? 'p-6' : 'p-4'} border border-gray-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Comparison Graph</h3>
        {(isHovered || isFullScreen) && (
          <button 
            onClick={onFullScreen}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setSelectedMethod('all')}
            className={`px-3 py-1 rounded text-sm ${
              selectedMethod === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Methods
          </button>
          <button 
            onClick={() => setSelectedMethod('raw')}
            className={`px-3 py-1 rounded text-sm ${
              selectedMethod === 'raw' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Raw TDOA
          </button>
          <button 
            onClick={() => setSelectedMethod('kalman')}
            className={`px-3 py-1 rounded text-sm ${
              selectedMethod === 'kalman' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Kalman Filter
          </button>
          <button 
            onClick={() => setSelectedMethod('ml')}
            className={`px-3 py-1 rounded text-sm ${
              selectedMethod === 'ml' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Machine Learning
          </button>
        </div>
      </div>
      
      <div className={`${isFullScreen ? 'h-[70vh]' : 'h-60'} bg-gray-50 rounded-lg`}>
        <Scatter data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div className="bg-red-50 p-2 rounded">
          <span className="font-semibold">Raw:</span> 
          ({rawTag[0].toFixed(2)}, {rawTag[1].toFixed(2)})
        </div>
        <div className="bg-blue-50 p-2 rounded">
          <span className="font-semibold">Kalman:</span> 
          ({kalmanTag[0].toFixed(2)}, {kalmanTag[1].toFixed(2)})
        </div>
        <div className="bg-purple-50 p-2 rounded">
          <span className="font-semibold">ML:</span> 
          ({mlTag[0].toFixed(2)}, {mlTag[1].toFixed(2)})
        </div>
      </div>
    </div>
  );
};
