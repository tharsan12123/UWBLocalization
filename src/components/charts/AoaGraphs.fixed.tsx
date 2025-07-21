import React, { useEffect, useState, useRef } from 'react';
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
// With 0 degrees at the positive Y axis, 90 degrees at positive X axis
function getBearingEnd(center: {x: number, y: number}, angleDeg: number, length: number) {
  // Convert to standard math angles (0 at +Y axis, clockwise)
  // SVG Y coordinates are flipped (positive down), so we negate Y component
  const angleRad = angleDeg * (Math.PI / 180); 
  return {
    x: center.x + length * Math.sin(angleRad), // sin for X because 0 is at Y axis
    y: center.y - length * Math.cos(angleRad)  // cos for Y and negate for SVG
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
  // Container ref for responsive sizing
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for dynamic dimensions and data
  const [dimensions, setDimensions] = useState({ width: 500, height: 600 });
  const [anchor1, setAnchor1] = useState<{x: number, y: number}>({x: -0.5, y: 0});
  const [anchor2, setAnchor2] = useState<{x: number, y: number}>({x: 0.5, y: 0});
  const [aoaAngle, setAoaAngle] = useState<number>(15.62);
  
  // View state for panning/moving the graph
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Logical range - expanded to ensure all coordinates are visible
  const xMin = -10, xMax = 15, yMin = -5, yMax = 15;  // Wide range to accommodate all anchor positions
  const margin = 50;
  
  // Update dimensions on resize or fullscreen toggle
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(300, rect.width - 16), // 16px for padding
          height: isFullScreen ? window.innerHeight * 0.7 : Math.min(600, rect.width * 0.8)
        });
      }
    };

    // Initial size
    updateDimensions();
    
    // Update on resize
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isFullScreen]);
  
  // Fetch data from Firebase
  useEffect(() => {
    const anglesRef = ref(db, '/RawAOA/angles');
    const anchorsRef = ref(db, '/RawAOA/anchors');
    
    // Listen for angle changes
    const unsubscribeAngles = onValue(anglesRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.a1 !== undefined) {
        setAoaAngle(parseFloat(data.a1));
        console.log("AOA angle updated:", data.a1);
      } else {
        console.log("No valid angle data received");
      }
    }, (error) => {
      console.error("Error fetching angle data:", error);
    });
    
    // Listen for anchor position changes
    const unsubscribeAnchors = onValue(anchorsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        console.log("No anchor data received");
        return;
      }
      
      // Process A1 anchor data
      if (data.A1) {
        try {
          // Handle both array and object formats from Firebase
          const x = parseFloat(data.A1[0] || data.A1["0"]) || 0;
          const y = parseFloat(data.A1[1] || data.A1["1"]) || 0;
          setAnchor1({x, y});
          console.log("A1 anchor updated:", x, y);
        } catch (err) {
          console.error("Error parsing A1 data:", err, data.A1);
        }
      }
      
      // Process A2 anchor data with fallback to ensure visibility
      if (data.A2) {
        try {
          // Handle both array and object formats from Firebase
          const x = parseFloat(data.A2[0] || data.A2["0"]) || 0;
          const y = parseFloat(data.A2[1] || data.A2["1"]) || 0;
          setAnchor2({x, y});
          console.log("A2 anchor updated:", x, y);
        } catch (err) {
          console.error("Error parsing A2 data:", err, data.A2);
        }
      } else {
        // If A2 is missing or invalid in Firebase, set a default position that's visible
        // Position it opposite to A1 if possible
        const defaultX = anchor1.x > 0 ? -1 : 1;
        setAnchor2({x: defaultX, y: 0});
        console.log("A2 anchor missing, using default position");
      }
    }, (error) => {
      console.error("Error fetching anchor data:", error);
    });
    
    return () => {
      unsubscribeAngles();
      unsubscribeAnchors();
    };
  }, [anchor1.x]); // Add anchor1.x as dependency for the A2 default position calculation
  
  // Track original and bounded coordinates separately
  // For A1
  const boundedAnchor1 = {
    x: Math.max(xMin + 0.5, Math.min(xMax - 0.5, anchor1.x)),
    y: Math.max(yMin + 0.5, Math.min(yMax - 0.5, anchor1.y))
  };
  
  // For A2
  const boundedAnchor2 = {
    x: Math.max(xMin + 0.5, Math.min(xMax - 0.5, anchor2.x)),
    y: Math.max(yMin + 0.5, Math.min(yMax - 0.5, anchor2.y))
  };
  
  // Scale X & Y coordinates from logical to pixel space with zoom and pan support
  const scaleX = (x: number): number => {
    return ((x - xMin - viewOffset.x) / (xMax - xMin) * zoom) * (dimensions.width - 2 * margin) + margin;
  };
  
  const scaleY = (y: number): number => {
    return dimensions.height - (((y - yMin - viewOffset.y) / (yMax - yMin) * zoom) * (dimensions.height - 2 * margin) + margin);
  };
  
  // Reverse scaling for mouse events
  const unscaleX = (pixelX: number): number => {
    return ((pixelX - margin) / (dimensions.width - 2 * margin)) * (xMax - xMin) / zoom + xMin + viewOffset.x;
  };
  
  const unscaleY = (pixelY: number): number => {
    return ((dimensions.height - pixelY - margin) / (dimensions.height - 2 * margin)) * (yMax - yMin) / zoom + yMin + viewOffset.y;
  };
  
  // Calculate endpoints for angle visualization
  const anchor1Scaled = { x: scaleX(boundedAnchor1.x), y: scaleY(boundedAnchor1.y) };
  const lineLength = 300; // Length of the AOA line
  
  // Ensure we have a valid angle before calculating
  const validAoaAngle = isNaN(aoaAngle) ? 0 : aoaAngle;
  
  const endPoint = getBearingEnd(anchor1Scaled, validAoaAngle, lineLength);
  
  // Generate grid lines based on view
  const generateYGridLines = () => {
    // Calculate visible range
    const visibleYMin = yMin + viewOffset.y;
    const visibleYMax = visibleYMin + (yMax - yMin) / zoom;
    const yStep = Math.max(1, Math.ceil((visibleYMax - visibleYMin) / 10));
    
    const yStart = Math.floor(visibleYMin / yStep) * yStep;
    const yEnd = Math.ceil(visibleYMax / yStep) * yStep;
    
    const lines = [];
    for (let i = yStart; i <= yEnd; i += yStep) {
      if (i >= yMin && i <= yMax) {
        lines.push(
          <React.Fragment key={`grid-h-${i}`}>
            <line 
              x1={margin} 
              y1={scaleY(i)} 
              x2={dimensions.width - margin} 
              y2={scaleY(i)}
              stroke="#e5e7eb" 
              strokeWidth="1"
            />
            <text 
              x={margin - 20} 
              y={scaleY(i)} 
              fontSize="10" 
              fill="#6b7280"
              dominantBaseline="middle"
            >
              {i}
            </text>
          </React.Fragment>
        );
      }
    }
    return lines;
  };
  
  const generateXGridLines = () => {
    // Calculate visible range
    const visibleXMin = xMin + viewOffset.x;
    const visibleXMax = visibleXMin + (xMax - xMin) / zoom;
    const xStep = Math.max(1, Math.ceil((visibleXMax - visibleXMin) / 10));
    
    const xStart = Math.floor(visibleXMin / xStep) * xStep;
    const xEnd = Math.ceil(visibleXMax / xStep) * xStep;
    
    const lines = [];
    for (let i = xStart; i <= xEnd; i += xStep) {
      if (i >= xMin && i <= xMax) {
        lines.push(
          <React.Fragment key={`grid-v-${i}`}>
            <line 
              x1={scaleX(i)} 
              y1={margin} 
              x2={scaleX(i)} 
              y2={dimensions.height - margin}
              stroke="#e5e7eb" 
              strokeWidth="1"
            />
            <text 
              x={scaleX(i)} 
              y={dimensions.height - margin + 20} 
              fontSize="10" 
              fill="#6b7280"
              textAnchor="middle"
            >
              {i}
            </text>
          </React.Fragment>
        );
      }
    }
    return lines;
  };
  
  return (
    <div className={`relative bg-white rounded-lg shadow-lg ${isFullScreen ? 'p-6 h-full' : 'p-4'} border border-gray-200`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Raw AOA Visualization</h3>
        <button 
          onClick={onFullScreen}
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>
      
      <div 
        ref={containerRef}
        className={`${isFullScreen ? 'h-[70vh]' : 'h-80'} bg-gray-50 rounded-lg overflow-hidden`}
      >
        <div className="flex justify-end mb-1">
          <button 
            onClick={() => {
              setViewOffset({ x: 0, y: 0 });
              setZoom(1);
            }}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-1"
          >
            Reset View
          </button>
          <button 
            onClick={() => setZoom(prev => Math.min(prev * 1.2, 5))}
            className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 mr-1"
          >
            Zoom In
          </button>
          <button 
            onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.5))}
            className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            Zoom Out
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute top-2 right-2 z-10 bg-white bg-opacity-80 p-1 rounded text-xs">
            Zoom: {zoom.toFixed(1)}x | View: ({(xMin + viewOffset.x).toFixed(1)}, {(yMin + viewOffset.y).toFixed(1)}) to ({(xMin + viewOffset.x + (xMax - xMin) / zoom).toFixed(1)}, {(yMin + viewOffset.y + (yMax - yMin) / zoom).toFixed(1)})
          </div>
          
          <svg 
            width={dimensions.width} 
            height={dimensions.height} 
            className="bg-gray-50 cursor-move"
            onMouseDown={(e) => {
              setIsDragging(true);
              setDragStart({ x: e.clientX, y: e.clientY });
            }}
            onMouseMove={(e) => {
              if (isDragging) {
                const dx = (e.clientX - dragStart.x) / (dimensions.width - 2 * margin) * (xMax - xMin) / zoom;
                const dy = (e.clientY - dragStart.y) / (dimensions.height - 2 * margin) * (yMax - yMin) / zoom;
                setViewOffset(prev => ({
                  x: prev.x - dx,
                  y: prev.y + dy // Invert Y direction for correct panning
                }));
                setDragStart({ x: e.clientX, y: e.clientY });
              }
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onWheel={(e) => {
              e.preventDefault();
              // Get mouse position in logical coordinates before zoom
              const mouseX = unscaleX(e.nativeEvent.offsetX);
              const mouseY = unscaleY(e.nativeEvent.offsetY);
              
              // Adjust zoom level
              const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
              const newZoom = Math.max(0.5, Math.min(5, zoom * zoomDelta));
              
              // Get mouse position in logical coordinates after zoom
              const newViewOffset = {
                x: viewOffset.x - (mouseX - unscaleX(e.nativeEvent.offsetX)),
                y: viewOffset.y - (mouseY - unscaleY(e.nativeEvent.offsetY))
              };
              
              setZoom(newZoom);
              setViewOffset(newViewOffset);
            }}
          >
            {/* Grid lines */}
            {generateYGridLines()}
            {generateXGridLines()}
            
            {/* Anchor points with improved visibility */}
            <circle 
              cx={anchor1Scaled.x} 
              cy={anchor1Scaled.y} 
              r="10" 
              fill="#3b82f6" 
              stroke="#1e40af"
              strokeWidth="3"
            />
            <text 
              x={anchor1Scaled.x + 12} 
              y={anchor1Scaled.y - 12} 
              fill="#1e40af" 
              fontSize="14"
              fontWeight="bold"
            >
              A1 ({anchor1.x.toFixed(1)}, {anchor1.y.toFixed(1)})
            </text>
            
            {/* Anchor 2 with increased size and visual prominence */}
            <circle 
              cx={scaleX(boundedAnchor2.x)} 
              cy={scaleY(boundedAnchor2.y)} 
              r="10" 
              fill="#10b981" 
              stroke="#047857"
              strokeWidth="3"
            />
            <text 
              x={scaleX(boundedAnchor2.x) + 12} 
              y={scaleY(boundedAnchor2.y) - 12} 
              fill="#047857" 
              fontSize="14"
              fontWeight="bold"
            >
              A2 ({anchor2.x.toFixed(1)}, {anchor2.y.toFixed(1)})
            </text>
            
            {/* Highlight around A2 to make it more visible */}
            <circle 
              cx={scaleX(boundedAnchor2.x)} 
              cy={scaleY(boundedAnchor2.y)} 
              r="15" 
              fill="transparent"
              stroke={boundedAnchor2.x !== anchor2.x || boundedAnchor2.y !== anchor2.y ? "#ef4444" : "#047857"}
              strokeWidth={boundedAnchor2.x !== anchor2.x || boundedAnchor2.y !== anchor2.y ? "2" : "1"}
              strokeDasharray="3"
            />
            
            {/* Indicator for bounded coordinates */}
            {(boundedAnchor2.x !== anchor2.x || boundedAnchor2.y !== anchor2.y) && (
              <text
                x={scaleX(boundedAnchor2.x)}
                y={scaleY(boundedAnchor2.y) + 25}
                fill="#ef4444"
                fontSize="10"
                textAnchor="middle"
              >
                Real position: ({anchor2.x.toFixed(1)}, {anchor2.y.toFixed(1)})
              </text>
            )}
            
            {/* AOA Line */}
            <line
              x1={anchor1Scaled.x}
              y1={anchor1Scaled.y}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="4"
            />
            
            {/* Angle indicator - starting from +Y axis */}
            <path
              d={`M ${anchor1Scaled.x} ${anchor1Scaled.y} 
                 L ${anchor1Scaled.x} ${anchor1Scaled.y - 30} 
                 A 30 30 0 ${validAoaAngle > 0 ? "0 1" : "0 0"} ${anchor1Scaled.x + 30 * Math.sin(validAoaAngle * Math.PI / 180)} ${anchor1Scaled.y - 30 * Math.cos(validAoaAngle * Math.PI / 180)}`}
              fill="none"
              stroke="#9333ea"
              strokeWidth="1.5"
            />
            
            <text
              x={anchor1Scaled.x + 40}
              y={anchor1Scaled.y - 20}
              fill="#9333ea"
              fontSize="12"
              fontWeight="bold"
            >
              {validAoaAngle.toFixed(1)}°
            </text>
          </svg>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-100 p-2 rounded">
          <span className="font-semibold">Anchor 1:</span> 
          <span>Actual: ({anchor1.x.toFixed(2)}, {anchor1.y.toFixed(2)})</span>
          {boundedAnchor1.x !== anchor1.x || boundedAnchor1.y !== anchor1.y ? (
            <span className="block text-xs text-amber-600">
              Display: ({boundedAnchor1.x.toFixed(2)}, {boundedAnchor1.y.toFixed(2)})
            </span>
          ) : null}
        </div>
        <div className="bg-blue-50 p-2 rounded">
          <span className="font-semibold">Anchor 2:</span> 
          <span className="text-blue-800">
            Actual: ({anchor2.x.toFixed(2)}, {anchor2.y.toFixed(2)})
          </span>
          {boundedAnchor2.x !== anchor2.x || boundedAnchor2.y !== anchor2.y ? (
            <span className="block text-xs text-amber-600">
              Display: ({boundedAnchor2.x.toFixed(2)}, {boundedAnchor2.y.toFixed(2)})
            </span>
          ) : null}
        </div>
        <div className="bg-gray-100 p-2 rounded col-span-2">
          <span className="font-semibold">AOA Angle:</span> 
          {validAoaAngle.toFixed(2)}° from Anchor 1
          <span className="ml-2 text-xs text-blue-600">(Updated from Firebase)</span>
        </div>
        <div className="bg-gray-50 p-2 rounded col-span-2 text-xs">
          <span className="font-semibold">View Controls:</span> 
          <span className="ml-1">Drag to pan • Mouse wheel to zoom • Use buttons to reset/zoom</span>
        </div>
      </div>
    </div>
  );
};

// ML-Enhanced AOA Graph Component
export const ImprovedAoaGraph: React.FC<AoaGraphProps> = ({ onFullScreen, isFullScreen }) => {
  // [This component remains unchanged]
  // The original implementation from the file would go here
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [rawPosition, setRawPosition] = useState<[number, number]>([0, 0]);
  const [history, setHistory] = useState<Array<[number, number]>>([]);
  const [rawHistory, setRawHistory] = useState<Array<[number, number]>>([]);
  const [anchors, setAnchors] = useState<{[key: string]: [number, number]}>({});
  const [updateCount, setUpdateCount] = useState(0);
  
  // Create a responsive chart options object
  const [chartOptions, setChartOptions] = useState(getDefaultOptions('ML-Enhanced AOA Localization'));
  
  // Helper function to parse coordinates from Firebase
  const parsePair = (input: any): [number, number] => {
    if (!input) return [0, 0];
    const x = parseFloat(input[0] ?? input["0"]) || 0;
    const y = parseFloat(input[1] ?? input["1"]) || 0;
    return [x, y];
  };
  
  // Update chart dimensions when container size changes
  useEffect(() => {
    const updateChartDimensions = () => {
      if (chartContainerRef.current) {
        const newOptions = { ...chartOptions };
        const aspectRatio = isFullScreen ? 2.5 : 1.8;
        
        // Update options with responsive settings
        newOptions.maintainAspectRatio = !isFullScreen;
        newOptions.responsive = true;
        newOptions.aspectRatio = aspectRatio;
        
        newOptions.animation = { duration: 400, easing: 'easeOutQuad' };
        
        setChartOptions(newOptions);
      }
    };
    
    updateChartDimensions();
    
    const resizeObserver = new ResizeObserver(updateChartDimensions);
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }
    
    return () => {
      if (chartContainerRef.current) {
        resizeObserver.unobserve(chartContainerRef.current);
      }
    };
  }, [isFullScreen]);
  
  // Fix for infinite loop: Use separate listeners for the three data sources
  useEffect(() => {
    // Create refs to the different data paths
    const rawAoaRef = ref(db, '/RawAOA');
    const mlRef = ref(db, '/ML');
    const mlAoaRef = ref(db, '/MLAOA');
    
    // Manage raw AOA data - Always update
    const rawUnsubscribe = onValue(rawAoaRef, (snapshot) => {
      const rawData = snapshot.val();
      if (!rawData) return;
      
      try {
        // Process raw angle data - 0 degrees at +Y axis (North), clockwise rotation
        const rawAngle = (rawData.angles?.a1 || 45) * (Math.PI / 180);
        const distance = 5;
        const rawX = Math.sin(rawAngle) * distance; // sin for X component when 0 is at Y axis
        const rawY = Math.cos(rawAngle) * distance; // cos for Y component when 0 is at Y axis
        const newRawPosition: [number, number] = [rawX, rawY];
        
        setRawPosition(newRawPosition);
        
        // Update history with size limit
        const historyLimit = isFullScreen ? 200 : 100;
        setRawHistory(prev => {
          const updated = [...prev, newRawPosition];
          return updated.length > historyLimit ? updated.slice(-historyLimit) : updated;
        });
        
        // Update anchors
        if (rawData.anchors) {
          const newAnchors: {[key: string]: [number, number]} = {};
          if (rawData.anchors.A1) newAnchors.A1 = parsePair(rawData.anchors.A1);
          if (rawData.anchors.A2) newAnchors.A2 = parsePair(rawData.anchors.A2);
          if (rawData.anchors.A3) newAnchors.A3 = parsePair(rawData.anchors.A3);
          setAnchors(newAnchors);
        }
        
        setUpdateCount(prev => prev + 1);
      } catch (err) {
        console.error("Error processing Raw AOA data:", err);
      }
    });
    
    // Get primary ML data
    const mlUnsubscribe = onValue(mlRef, (snapshot) => {
      const mlData = snapshot.val();
      if (!mlData?.tag_ML) return;
      
      try {
        const newPosition = parsePair(mlData.tag_ML);
        setPosition(newPosition);
        
        const historyLimit = isFullScreen ? 200 : 100;
        setHistory(prev => {
          const updated = [...prev, newPosition];
          return updated.length > historyLimit ? updated.slice(-historyLimit) : updated;
        });
      } catch (err) {
        console.error("Error processing ML data:", err);
      }
    });
    
    // Fallback to ML AOA data
    const mlAoaUnsubscribe = onValue(mlAoaRef, (snapshot) => {
      const mlaoaData = snapshot.val();
      if (!mlaoaData?.tag_ml) return;
      
      try {
        const newPosition = parsePair(mlaoaData.tag_ml);
        
        // Only update if no position from ML source
        setPosition(current => {
          if (current[0] === 0 && current[1] === 0) {
            return newPosition;
          }
          return current;
        });
      } catch (err) {
        console.error("Error processing MLAOA data:", err);
      }
    });
    
    // Clean up all listeners
    return () => {
      rawUnsubscribe();
      mlUnsubscribe();
      mlAoaUnsubscribe();
    };
  }, [isFullScreen]);
  
  // Create chart data
  const chartData = {
    datasets: [
      ...createAnchorDatasets(anchors),
      createHistoryDataset(rawHistory, 'Raw Tag Path', 'rgba(255, 159, 64, 0.3)'),
      createPositionDataset(rawPosition[0], rawPosition[1], 'Raw Position', 'rgba(255, 159, 64, 0.8)'),
      createHistoryDataset(history, 'ML Tag Path', 'rgba(75, 192, 192, 0.5)'),
      createPositionDataset(position[0], position[1], 'ML Enhanced Position', 'rgba(75, 192, 192, 1)'),
    ]
  };
  
  // Calculate error metrics
  const errorDistance = Math.sqrt(
    Math.pow(rawPosition[0] - position[0], 2) +
    Math.pow(rawPosition[1] - position[1], 2)
  );
  
  return (
    <div 
      className={`relative bg-white rounded-lg shadow-lg ${isFullScreen ? 'p-6 h-full' : 'p-4'} border border-gray-200`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Improved AOA with ML (from /MLAOA & /ML)
          <span className="ml-2 text-xs text-gray-500">{updateCount > 0 ? `(Updates: ${updateCount})` : ''}</span>
        </h3>
        <button 
          onClick={onFullScreen}
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>
      
      <div 
        ref={chartContainerRef}
        className={`${isFullScreen ? 'h-[70vh]' : 'h-80'} bg-gray-50 rounded-lg`}
        key={`chart-container-${isFullScreen ? 'full' : 'normal'}`}
      >
        <Scatter 
          data={chartData} 
          options={chartOptions} 
          key={`chart-${updateCount}`}
        />
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-100 p-2 rounded">
          <span className="font-semibold">Raw Position (RawAOA):</span> 
          ({rawPosition[0].toFixed(2)}, {rawPosition[1].toFixed(2)})
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <span className="font-semibold">ML Position (ML/MLAOA):</span> 
          ({position[0].toFixed(2)}, {position[1].toFixed(2)})
        </div>
        <div className={`p-2 rounded col-span-2 ${errorDistance < 0.5 ? 'bg-green-50' : 'bg-amber-50'}`}>
          <span className="font-semibold">Error Reduction:</span> 
          {errorDistance.toFixed(2)} meters
          {errorDistance < 0.5 && <span className="ml-2 text-green-600">✓ Good</span>}
        </div>
        <div className="bg-blue-50 p-2 rounded col-span-2 text-xs">
          <span className="font-semibold">Data Sources:</span> 
          <span className="ml-1">Position data calculated from RawAOA.angles.a1 and ML.tag_ML</span>
        </div>
      </div>
    </div>
  );
};
