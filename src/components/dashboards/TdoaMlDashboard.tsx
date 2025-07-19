import React, { useEffect, useRef, useState } from 'react';
import { UwbAnchor } from '../UwbAnchor';
import { UwbTag } from '../UwbTag';
import { MetricsPanel } from '../MetricsPanel';
import { MapPin, Target } from 'lucide-react';
import useMLLocalizationData from '../../useMlLocalizationData';

export const TdoaMlDashboard: React.FC = () => {
  const mlData = useMLLocalizationData();
  const [isTracking, setIsTracking] = useState(false);
  const [zoom, setZoom] = useState(0.7);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tagTrail, setTagTrail] = useState<{ x: number; y: number }[]>([]);
  const scale = 100; // 1m = 100px
  const gridSize = 0.6; // meters per grid box
  const canvasHeight = 550;

  const toPixels = (x: number, y: number) => ({
    x: x * scale * zoom + offset.x,
    y: canvasHeight - y * scale * zoom + offset.y
  });

  const tag = mlData?.tag_ML ?? [0, 0];
  const accuracy = mlData?.accuracy ?? 0;
  const anchors = mlData?.anchors ?? {};
  useEffect(() => {
    if (!isTracking) return;
    setTagTrail((prev) => {
      const updated = [...prev, tagPosition];
      return updated.length > 100 ? updated.slice(-100) : updated;
    });
  }, [tag[0], tag[1], isTracking]); // track actual value, not pixel

  const anchorColors: Record<string, string> = {
    A1: 'bg-blue-600',
    A2: 'bg-green-600',
    A3: 'bg-purple-600'
  };

  const anchorList = ['A1', 'A2', 'A3'].map((id) => {
    const [x, y] = anchors[id] ?? [0, 0];
    return {
      id,
      position: toPixels(x, y),
      realX: x,
      realY: y,
      color: anchorColors[id] || 'bg-gray-600',
    };
  });

  const tagPosition = toPixels(tag[0], tag[1]);

  const metrics = [
    { label: 'Tag X Position', value: `${tag[0].toFixed(2)} m`, icon: MapPin },
    { label: 'Tag Y Position', value: `${tag[1].toFixed(2)} m`, icon: MapPin },
    { label: 'Accuracy', value: `±${accuracy.toFixed(1)} m`, icon: Target },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">TDOA with Machine Learning</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setZoom(z => Math.min(2, z + 0.1))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Zoom In
            </button>
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Zoom Out
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Reset View
            </button>
            <button
              onClick={() => {
                setIsTracking((prev) => !prev);
                if (isTracking) setTagTrail([]); // clear trail if stopping
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isTracking
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Localization Area</h3>
            <div
              className="relative w-full h-[600px] bg-white border border-gray-300 overflow-hidden cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Grid */}
              <div className="absolute inset-0">
                {Array.from({ length: 100 }, (_, i) => (
                  <div
                    key={`vline-${i}`}
                    className="absolute w-px bg-gray-200"
                    style={{ left: `${i * gridSize * scale * zoom + offset.x}px`, height: '100%' }}
                  />
                ))}
                {Array.from({ length: 100 }, (_, i) => (
                  <div
                    key={`hline-${i}`}
                    className="absolute h-px bg-gray-200"
                    style={{ top: `${canvasHeight - i * gridSize * scale * zoom + offset.y}px`, width: '100%' }}
                  />
                ))}
              </div>

              {/* Axes */}
              <svg className="absolute inset-0 w-full h-full">
                <line x1={offset.x} y1={0} x2={offset.x} y2={canvasHeight} stroke="gray" strokeWidth="1" />
                <line x1={0} y1={canvasHeight - offset.y} x2={2000} y2={canvasHeight - offset.y} stroke="gray" strokeWidth="1" />
              </svg>

{/* Axes + Red Dashed Polygon */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Axes */}
                <line x1={offset.x} y1={0} x2={offset.x} y2={550} stroke="gray" strokeWidth="1" />
                <line x1={0} y1={550 - offset.y} x2={2000} y2={550 - offset.y} stroke="gray" strokeWidth="1" />

                {/* Red Dashed Polygon */}
                <polyline
                  fill="none"
                  stroke="red"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                  points={
                    [
                      toPixels(1.8, 1.38),
                      toPixels(1.8, 3.18),
                      toPixels(3, 3.18),
                      toPixels(3, 3.75),
                      toPixels(6, 3.75),
                      toPixels(6, 1.38),
                      toPixels(1.8, 1.38),
                    ]
                      .map((p) => `${p.x},${p.y}`)
                      .join(' ')
                  }
                />
              </svg>
              {/* Axes */}
              <svg className="absolute inset-0 w-full h-full">
                <line x1={offset.x} y1={0} x2={offset.x} y2={550} stroke="gray" strokeWidth="1" />
                <line x1={0} y1={550 - offset.y} x2={2000} y2={550 - offset.y} stroke="gray" strokeWidth="1" />

                {/* Dashed trail polyline */}
                {tagTrail.length > 1 && (
                  <polyline
                    points={tagTrail.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="purple"
                    strokeWidth="2"
                    
                  />
                )}
              </svg>

              {/* Axis Labels */}
              {Array.from({ length: 100 }, (_, i) => (
                <div
                  key={`xlabel-${i}`}
                  className="absolute text-xs text-gray-400"
                  style={{
                    left: `${i * gridSize * scale * zoom + offset.x + 2}px`,
                    top: `${550 - offset.y + 2}px`,
                  }}
                >
                  {`${(i * gridSize).toFixed(1)}m`}
                </div>
              ))}
              {Array.from({ length: 100 }, (_, i) => (
                <div
                  key={`ylabel-${i}`}
                  className="absolute text-xs text-gray-400"
                  style={{
                    top: `${550 - i * gridSize * scale * zoom + offset.y}px`,
                    left: `${offset.x + 2}px`,
                  }}
                >
                  {`${(i * gridSize).toFixed(1)}m`}
                </div>
              ))}

              {/* Anchors */}
              {anchorList.map((anchor) => (
                <div key={anchor.id}>
                  <UwbAnchor id={anchor.id} position={anchor.position} color={anchor.color} isActive={isTracking} />
                  <div
                    className="absolute text-xs text-black"
                    style={{ left: anchor.position.x + 16, top: anchor.position.y - 16 }}
                  >
                    ({anchor.realX.toFixed(1)}, {anchor.realY.toFixed(1)}) m
                  </div>
                </div>
              ))}
              {/* Tag Trail Dots */}
              {tagTrail.map((pos, index) => (
                <div
                  key={`trail-${index}`}
                  className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-70"
                  style={{ left: pos.x - 4, top: pos.y - 4 }}
                />
              ))}
              {/* ML Tag */}
              <UwbTag id="ML" position={tagPosition} isActive={isTracking} color="bg-blue-600" />
            </div>
          </div>

          <div className="w-56 space-y-4">
            <MetricsPanel metrics={metrics} />
          </div>
        </div>
      </div>
    </div>
  );
};
