// Updated Full Code: RawAoaGraph + ImprovedAoaGraph (SVG-based like Raw)
import React, { useEffect, useState, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase';

function getBearingEnd(center, angleDeg, length) {
  const angleRad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: center.x + length * Math.cos(angleRad),
    y: center.y + length * Math.sin(angleRad),
  };
}

function useResize(containerRef, ratio = 0.38) {
  const [svgSize, setSvgSize] = useState({ width: 500, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setSvgSize({ width, height: width * ratio });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return svgSize;
}

function mapX(x, xMin, xMax, width, margin) {
  return margin + ((x - xMin) / (xMax - xMin)) * (width - 2 * margin);
}

function mapY(y, yMin, yMax, height, margin) {
  return height - margin - ((y - yMin) / (yMax - yMin)) * (height - 2 * margin);
}

const margin = 50;
const xMin = -6, xMax = 6, yMin = 0, yMax = 5;
const bearingLen = 300;

export const RawAoaGraph = ({ onFullScreen, isFullScreen }) => {
  const containerRef = useRef(null);
  const svgSize = useResize(containerRef);
  const [aoaAngle, setAoaAngle] = useState(0);
  const [anchor1, setAnchor1] = useState({ x: -0.5, y: 0 });
  const [anchor2, setAnchor2] = useState({ x: 0.5, y: 0 });

  useEffect(() => {
    const aoaRef = ref(db, 'RawAOA');
    const unsub = onValue(aoaRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      setAoaAngle(parseFloat(data.angles?.a1 || 0));
      const px = (a) => ({ x: parseFloat(a?.[0] ?? a?.['0']) || 0, y: parseFloat(a?.[1] ?? a?.['1']) || 0 });
      if (data.anchors?.A1) setAnchor1(px(data.anchors.A1));
      if (data.anchors?.A2) setAnchor2(px(data.anchors.A2));
    });
    return () => unsub();
  }, []);

  return (
    <AoaSvgGraph
      containerRef={containerRef}
      svgSize={svgSize}
      aoaAngle={aoaAngle}
      anchor1={anchor1}
      anchor2={anchor2}
      title={`Raw AoA: ${aoaAngle.toFixed(2)}°`}
      onFullScreen={onFullScreen}
      isFullScreen={isFullScreen}
      label="Raw AOA"
    />
  );
};

export const ImprovedAoaGraph = ({ onFullScreen, isFullScreen }) => {
  const containerRef = useRef(null);
  const svgSize = useResize(containerRef);
  const [aoaAngle, setAoaAngle] = useState(0);
  const [anchor1, setAnchor1] = useState({ x: -0.5, y: 0 });
  const [anchor2, setAnchor2] = useState({ x: 0.5, y: 0 });

  useEffect(() => {
    const mlRef = ref(db, 'MLAOA');
    const unsub = onValue(mlRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      setAoaAngle(parseFloat(data.angles?.a1 || 0));
      const px = (a) => ({ x: parseFloat(a?.[0] ?? a?.['0']) || 0, y: parseFloat(a?.[1] ?? a?.['1']) || 0 });
      if (data.anchors?.A1) setAnchor1(px(data.anchors.A1));
      if (data.anchors?.A2) setAnchor2(px(data.anchors.A2));
    });
    return () => unsub();
  }, []);

  return (
    <AoaSvgGraph
      containerRef={containerRef}
      svgSize={svgSize}
      aoaAngle={aoaAngle}
      anchor1={anchor1}
      anchor2={anchor2}
      title={`Kalman AoA: ${aoaAngle.toFixed(2)}°`}
      onFullScreen={onFullScreen}
      isFullScreen={isFullScreen}
      label="Improved AOA with Kalman"
    />
  );
};

const AoaSvgGraph = ({ containerRef, svgSize, aoaAngle, anchor1, anchor2, title, onFullScreen, isFullScreen, label }) => {
  const { width, height } = svgSize;
  const center = { x: 0, y: 0 };
  const svgCenter = {
    x: mapX(center.x, xMin, xMax, width, margin),
    y: mapY(center.y, yMin, yMax, height, margin),
  };
  const bearingEnd = getBearingEnd(svgCenter, aoaAngle, bearingLen);

  const refLine = {
    x1: mapX(anchor1.x, xMin, xMax, width, margin),
    y1: mapY(anchor1.y, yMin, yMax, height, margin),
    x2: mapX(anchor2.x, xMin, xMax, width, margin),
    y2: mapY(anchor2.y, yMin, yMax, height, margin),
  };

  const xTicks = Array.from({ length: Math.floor((xMax - xMin) / 0.6 + 1) }, (_, i) => +(xMin + i * 0.6).toFixed(2));
  const yTicks = Array.from({ length: Math.floor((yMax - yMin) / 0.6 + 1) }, (_, i) => +(yMin + i * 0.6).toFixed(2));

  return (
    <div ref={containerRef} className="relative bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-700">{label}</span>
        {!isFullScreen && (
          <button onClick={onFullScreen} className="text-gray-400 hover:text-blue-600">
            <svg width={20} height={20} viewBox="0 0 20 20">
              <rect x="2" y="2" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        )}
      </div>
      <svg width={width} height={height} style={{ background: '#f9fafb', borderRadius: 12 }}>
        {xTicks.map((x, i) => (
          <line key={`x-${i}`} x1={mapX(x, xMin, xMax, width, margin)} y1={mapY(yMin, yMin, yMax, height, margin)} x2={mapX(x, xMin, xMax, width, margin)} y2={mapY(yMax, yMin, yMax, height, margin)} stroke="#e5e7eb" strokeWidth={x === 0 ? 2 : 1} />
        ))}
        {yTicks.map((y, i) => (
          <line key={`y-${i}`} x1={mapX(xMin, xMin, xMax, width, margin)} y1={mapY(y, yMin, yMax, height, margin)} x2={mapX(xMax, xMin, xMax, width, margin)} y2={mapY(y, yMin, yMax, height, margin)} stroke="#e5e7eb" strokeWidth={y === 0 ? 2 : 1} />
        ))}

        <line x1={mapX(xMin, xMin, xMax, width, margin)} y1={mapY(0, yMin, yMax, height, margin)} x2={mapX(xMax, xMin, xMax, width, margin)} y2={mapY(0, yMin, yMax, height, margin)} stroke="#111" strokeWidth={2} />
        <line x1={mapX(0, xMin, xMax, width, margin)} y1={mapY(yMin, yMin, yMax, height, margin)} x2={mapX(0, xMin, xMax, width, margin)} y2={mapY(yMax, yMin, yMax, height, margin)} stroke="#111" strokeWidth={2} />

        <line x1={refLine.x1} y1={refLine.y1} x2={refLine.x2} y2={refLine.y2} stroke="#888" strokeDasharray="6 4" strokeWidth={3} />

        <circle cx={svgCenter.x} cy={svgCenter.y} r={9} fill="#fff" stroke="#111" strokeWidth={2} />
        <line x1={svgCenter.x} y1={svgCenter.y} x2={bearingEnd.x} y2={bearingEnd.y} stroke="#f43f5e" strokeWidth={5} markerEnd="url(#arrowhead)" />

        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
            <polygon points="0,0 10,5 0,10" fill="#f43f5e" />
          </marker>
        </defs>

        {xTicks.map((x, i) => (
          <text key={`xtick-${i}`} x={mapX(x, xMin, xMax, width, margin)} y={height - margin + 22} fontSize={12} textAnchor="middle" fill={x === 0 ? '#111' : '#888'} fontWeight={x === 0 ? 'bold' : 'normal'}>{x}</text>
        ))}
        {yTicks.map((y, i) => (
          <text key={`ytick-${i}`} x={margin - 24} y={mapY(y, yMin, yMax, height, margin) + 4} fontSize={12} textAnchor="end" fill={y === 0 ? '#111' : '#888'} fontWeight={y === 0 ? 'bold' : 'normal'}>{y}</text>
        ))}

        <text x={width / 2} y={height - 10} fontSize={16} textAnchor="middle" fill="#222">X (meters)</text>
        <text x={margin - 40} y={height / 2} fontSize={16} textAnchor="middle" fill="#222" transform={`rotate(-90,${margin - 40},${height / 2})`}>Y (meters)</text>

        <text x={width / 2} y={margin - 22} fontSize={20} textAnchor="middle" fill="#222" fontWeight="bold">{title}</text>
      </svg>
    </div>
  );
};
