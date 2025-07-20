import React, { useEffect, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Scatter } from 'react-chartjs-2';
import { db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { 
  getDefaultOptions, 
  createPositionDataset, 
  createHistoryDataset,
  createAnchorDatasets
} from '../charts/ChartUtils';

// Helper to convert angle (degrees) to SVG coordinates
function getBearingEnd(center: {x: number, y: number}, angleDeg: number, length: number) {
  const angleRad = (angleDeg - 90) * (Math.PI / 180); // SVG 0deg is up
  return {
    x: center.x + length * Math.cos(angleRad),
    y: center.y + length * Math.sin(angleRad)
  };
}

interface AoaGraphProps {
  onFullScreen: () => void;
  isFullScreen: boolean;
}

// Raw AOA Graph Component
export const RawAoaGraph: React.FC<AoaGraphProps> = ({ 
  onFullScreen, 
  isFullScreen 
}) => {
  // Anchors at (-0.5, 0) and (0.5, 0)
  const [anchor1] = useState<{x: number, y: number}>({x: -0.5, y: 0});
  const [anchor2] = useState<{x: number, y: number}>({x: 0.5, y: 0});
  const [aoaAngle, setAoaAngle] = useState<number>(15.62); // Example AoA

  // SVG settings
  const width = 500, height = 600, margin = 50;
  // Logical range
  const xMin = -6, xMax = 6, yMin = 0, yMax = 10;
  // Map logical (x,y) to SVG
  const mapX = (x: number) => margin + ((x - xMin) / (xMax - xMin)) * (width - 2 * margin);
  const mapY = (y: number) => height - margin - ((y - yMin) / (yMax - yMin)) * (height - 2 * margin);

  // Midpoint
  const center = { x: 0, y: 0 };
  const svgCenter = { x: mapX(center.x), y: mapY(center.y) };

  // Reference line between anchors
  const refLine = {
    x1: mapX(anchor1.x), y1: mapY(anchor1.y),
    x2: mapX(anchor2.x), y2: mapY(anchor2.y)
  };

  // Bearing line
  const bearingLen = 300;
  const bearingEnd = getBearingEnd(svgCenter, aoaAngle, bearingLen);

  // Grid ticks
  const xTicks = [];
  for (let x = xMin; x <= xMax + 0.01; x += 0.6) xTicks.push(Number(x.toFixed(2)));
  const yTicks = [];
  for (let y = yMin; y <= yMax + 0.01; y += 0.6) yTicks.push(Number(y.toFixed(2)));

  return (
    <div className="relative bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-700">Raw AOA</span>
        {!isFullScreen && (
          <button onClick={onFullScreen} className="text-gray-400 hover:text-blue-600">
            <svg width={20} height={20} viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
          </button>
        )}
      </div>
      <svg width={width} height={height} style={{ background: '#f9fafb', borderRadius: 12 }}>
        {/* Grid */}
        {xTicks.map((x, i) => (
          <line
            key={`xgrid-${i}`}
            x1={mapX(x)} y1={mapY(yMin)}
            x2={mapX(x)} y2={mapY(yMax)}
            stroke="#e5e7eb"
            strokeWidth={x === 0 ? 2 : 1}
          />
        ))}
        {yTicks.map((y, i) => (
          <line
            key={`ygrid-${i}`}
            x1={mapX(xMin)} y1={mapY(y)}
            x2={mapX(xMax)} y2={mapY(y)}
            stroke="#e5e7eb"
            strokeWidth={y === 0 ? 2 : 1}
          />
        ))}
        {/* Axis */}
        <line x1={mapX(xMin)} y1={mapY(0)} x2={mapX(xMax)} y2={mapY(0)} stroke="#111" strokeWidth={2} />
        <line x1={mapX(0)} y1={mapY(yMin)} x2={mapX(0)} y2={mapY(yMax)} stroke="#111" strokeWidth={2} />
        {/* Anchors */}
        <circle cx={mapX(anchor1.x)} cy={mapY(anchor1.y)} r={12} fill="#2563eb" stroke="#fff" strokeWidth={3} />
        <text x={mapX(anchor1.x) - 20} y={mapY(anchor1.y) - 10} fontSize={16} fill="#2563eb" fontWeight="bold">A1</text>
        <circle cx={mapX(anchor2.x)} cy={mapY(anchor2.y)} r={12} fill="#2563eb" stroke="#fff" strokeWidth={3} />
        <text x={mapX(anchor2.x) + 16} y={mapY(anchor2.y) - 10} fontSize={16} fill="#2563eb" fontWeight="bold">A2</text>
        {/* Reference line */}
        <line x1={refLine.x1} y1={refLine.y1} x2={refLine.x2} y2={refLine.y2} stroke="#888" strokeDasharray="6 4" strokeWidth={3} />
        {/* Midpoint */}
        <circle cx={svgCenter.x} cy={svgCenter.y} r={9} fill="#fff" stroke="#111" strokeWidth={2} />
        <text x={svgCenter.x + 12} y={svgCenter.y - 12} fontSize={14} fill="#111">Midpoint</text>
        {/* Bearing line */}
        <line x1={svgCenter.x} y1={svgCenter.y} x2={bearingEnd.x} y2={bearingEnd.y} stroke="#f43f5e" strokeWidth={5} markerEnd="url(#arrowhead)" />
        {/* Arrowhead marker */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
            <polygon points="0,0 10,5 0,10" fill="#f43f5e" />
          </marker>
        </defs>
        {/* Axis labels */}
        {xTicks.map((x, i) => (
          <text
            key={`xlabel-${i}`}
            x={mapX(x)}
            y={height - margin + 22}
            fontSize={12}
            textAnchor="middle"
            fill={x === 0 ? "#111" : "#888"}
            fontWeight={x === 0 ? "bold" : "normal"}
          >
            {x}
          </text>
        ))}
        {yTicks.map((y, i) => (
          <text
            key={`ylabel-${i}`}
            x={margin - 24}
            y={mapY(y) + 4}
            fontSize={12}
            textAnchor="end"
            fill={y === 0 ? "#111" : "#888"}
            fontWeight={y === 0 ? "bold" : "normal"}
          >
            {y}
          </text>
        ))}
        {/* Axis titles */}
        <text x={width / 2} y={height - 10} fontSize={16} textAnchor="middle" fill="#222">X (meters)</text>
        <text x={margin - 40} y={height / 2} fontSize={16} textAnchor="middle" fill="#222" transform={`rotate(-90,${margin - 40},${height / 2})`}>Y (meters)</text>
        {/* Title */}
        <text x={width / 2} y={margin - 22} fontSize={20} textAnchor="middle" fill="#222" fontWeight="bold">
          AoA: {aoaAngle.toFixed(2)}°
        </text>
      </svg>
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
          {(
            Math.sqrt(
              Math.pow(rawPosition[0] - position[0], 2) +
              Math.pow(rawPosition[1] - position[1], 2)
            ).toFixed(2)
          )} meters
        </div>
      </div>
    </div>
  );
};