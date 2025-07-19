import React, { useState, useEffect } from 'react';
import { UwbAnchor } from '../UwbAnchor';
import { UwbTag } from '../UwbTag';
import { MetricsPanel } from '../MetricsPanel';
import { MapPin, Compass, Target, RotateCcw } from 'lucide-react';

export const AoaDashboard: React.FC = () => {
  const [tagPosition, setTagPosition] = useState({ x: 200, y: 150 });
  const [isTracking, setIsTracking] = useState(false);
  const [angles, setAngles] = useState({
    a1: 45,
    a2: 135,
    a3: 270
  });

  const anchors = [
    { id: 'A1', position: { x: 50, y: 50 }, color: 'bg-blue-600' },
    { id: 'A2', position: { x: 350, y: 50 }, color: 'bg-green-600' },
    { id: 'A3', position: { x: 200, y: 250 }, color: 'bg-purple-600' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTracking) {
        const newPosition = {
          x: Math.max(70, Math.min(330, tagPosition.x + (Math.random() - 0.5) * 20)),
          y: Math.max(70, Math.min(230, tagPosition.y + (Math.random() - 0.5) * 20))
        };
        
        setTagPosition(newPosition);
        
        // Calculate angles from each anchor to the tag
        const newAngles = {
          a1: Math.atan2(newPosition.y - anchors[0].position.y, newPosition.x - anchors[0].position.x) * 180 / Math.PI + (Math.random() - 0.5) * 10,
          a2: Math.atan2(newPosition.y - anchors[1].position.y, newPosition.x - anchors[1].position.x) * 180 / Math.PI + (Math.random() - 0.5) * 10,
          a3: Math.atan2(newPosition.y - anchors[2].position.y, newPosition.x - anchors[2].position.x) * 180 / Math.PI + (Math.random() - 0.5) * 10
        };
        
        setAngles(newAngles);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isTracking, tagPosition]);

  const metrics = [
    { label: 'Tag X Position', value: `${((tagPosition.x - 50) / 10).toFixed(1)} m`, icon: MapPin },
    { label: 'Tag Y Position', value: `${((250 - tagPosition.y) / 10).toFixed(1)} m`, icon: MapPin },
    { label: 'Angle from A1', value: `${angles.a1.toFixed(1)}°`, icon: Compass },
    { label: 'Angle from A2', value: `${angles.a2.toFixed(1)}°`, icon: Compass },
    { label: 'Angle from A3', value: `${angles.a3.toFixed(1)}°`, icon: Compass },
    { label: 'Accuracy', value: '±2°', icon: Target },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Angle of Arrival (AOA)</h2>
          <button
            onClick={() => setIsTracking(!isTracking)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isTracking 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </button>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Localization Area</h3>
            <div className="relative w-full h-96 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 21 }, (_, i) => (
                  <div key={`v-${i}`} className="absolute bg-gray-300 w-px h-full" style={{ left: `${i * 5}%` }} />
                ))}
                {Array.from({ length: 17 }, (_, i) => (
                  <div key={`h-${i}`} className="absolute bg-gray-300 h-px w-full" style={{ top: `${i * 6.25}%` }} />
                ))}
              </div>

              {/* Anchors */}
              {anchors.map((anchor) => (
                <UwbAnchor
                  key={anchor.id}
                  id={anchor.id}
                  position={anchor.position}
                  color={anchor.color}
                  isActive={isTracking}
                />
              ))}

              {/* Tag */}
              <UwbTag
                id="Tag"
                position={tagPosition}
                isActive={isTracking}
              />

              {/* Angle lines */}
              {isTracking && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {anchors.map((anchor, index) => {
                    const angle = Object.values(angles)[index];
                    const lineLength = 60;
                    const endX = anchor.position.x + Math.cos(angle * Math.PI / 180) * lineLength;
                    const endY = anchor.position.y + Math.sin(angle * Math.PI / 180) * lineLength;
                    
                    return (
                      <g key={`angle-${index}`}>
                        <line
                          x1={anchor.position.x}
                          y1={anchor.position.y}
                          x2={endX}
                          y2={endY}
                          stroke={anchor.color.replace('bg-', '').replace('-600', '')}
                          strokeWidth="3"
                          opacity="0.7"
                        />
                        <polygon
                          points={`${endX},${endY} ${endX - 8},${endY - 4} ${endX - 8},${endY + 4}`}
                          fill={anchor.color.replace('bg-', '').replace('-600', '')}
                          opacity="0.7"
                        />
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>

          <div className="w-80 space-y-4">
            <MetricsPanel metrics={metrics} />
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm font-semibold mb-2">AOA Principle</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1"></div>
                  <div>
                    <p className="font-medium">Antenna Arrays</p>
                    <p className="text-gray-600">Multiple antennas measure signal phase differences</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1"></div>
                  <div>
                    <p className="font-medium">Phase Difference</p>
                    <p className="text-gray-600">Calculate arrival angle from phase measurements</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1"></div>
                  <div>
                    <p className="font-medium">Triangulation</p>
                    <p className="text-gray-600">Use angles from multiple anchors to find position</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-1"></div>
                  <div>
                    <p className="font-medium">Beamforming</p>
                    <p className="text-gray-600">Focus antenna pattern towards the tag</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};