// Fixed SVG section - You can copy this into your file to replace the broken parts

// Inside the return statement of RawAoaGraph component
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
      {/* Y Grid lines */}
      {(() => {
        // Calculate visible range
        const visibleYMin = yMin + viewOffset.y;
        const visibleYMax = visibleYMin + (yMax - yMin) / zoom;
        const yStep = Math.max(1, Math.ceil((visibleYMax - visibleYMin) / 10));
        
        const yStart = Math.floor(visibleYMin / yStep) * yStep;
        const yEnd = Math.ceil(visibleYMax / yStep) * yStep;
        
        const yLines = [];
        for (let i = yStart; i <= yEnd; i += yStep) {
          if (i >= yMin && i <= yMax) {
            yLines.push(
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
        return yLines;
      })()}
      
      {/* X Grid lines */}
      {(() => {
        // Calculate visible range
        const visibleXMin = xMin + viewOffset.x;
        const visibleXMax = visibleXMin + (xMax - xMin) / zoom;
        const xStep = Math.max(1, Math.ceil((visibleXMax - visibleXMin) / 10));
        
        const xStart = Math.floor(visibleXMin / xStep) * xStep;
        const xEnd = Math.ceil(visibleXMax / xStep) * xStep;
        
        const xLines = [];
        for (let i = xStart; i <= xEnd; i += xStep) {
          if (i >= xMin && i <= xMax) {
            xLines.push(
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
        return xLines;
      })()}
      
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
