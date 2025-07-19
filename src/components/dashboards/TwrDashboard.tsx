import React, { useState, useEffect } from 'react';
import { UwbModule } from '../UwbModule';
import { MetricsPanel } from '../MetricsPanel';
import { Radio, Signal, Clock } from 'lucide-react';

export const TwrDashboard: React.FC = () => {
  const [distance, setDistance] = useState(2.45);
  const [signalStrength, setSignalStrength] = useState(-45);
  const [isRanging, setIsRanging] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRanging) {
        setDistance(prev => prev + (Math.random() - 0.5) * 0.1);
        setSignalStrength(prev => prev + (Math.random() - 0.5) * 2);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isRanging]);

  const metrics = [
    { label: 'Distance', value: `${distance.toFixed(2)} m`, icon: Signal },
    { label: 'Signal Strength', value: `${signalStrength.toFixed(1)} dBm`, icon: Radio },
    { label: 'Round Trip Time', value: `${(distance * 2 / 299792458 * 1e9).toFixed(2)} ns`, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Two-Way Ranging (TWR)</h2>
          <button
            onClick={() => setIsRanging(!isRanging)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isRanging 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isRanging ? 'Stop Ranging' : 'Start Ranging'}
          </button>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
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

                <div className="flex items-center justify-between p-8">
                  <UwbModule 
                    id="Module A" 
                    type="initiator" 
                    position={{ x: 50, y: 50 }}
                    isActive={isRanging}
                  />
                  <div className="flex-1 mx-4">
                    <div className="relative">
                      <div className="h-1 bg-gray-200 rounded-full">
                        <div 
                          className="h-1 bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: isRanging ? '100%' : '0%' }}
                        />
                      </div>
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
                        {distance.toFixed(2)} m
                      </div>
                    </div>
                  </div>
                  <UwbModule 
                    id="Module B" 
                    type="responder" 
                    position={{ x: 250, y: 50 }}
                    isActive={isRanging}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-80 space-y-4">
            <MetricsPanel metrics={metrics} />
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm font-semibold mb-2">TWR Process</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1"></div>
                  <div>
                    <p className="font-medium">1. Poll Message</p>
                    <p className="text-gray-600">Initiator sends poll message to responder</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1"></div>
                  <div>
                    <p className="font-medium">2. Response Message</p>
                    <p className="text-gray-600">Responder replies with response message</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1"></div>
                  <div>
                    <p className="font-medium">3. Final Message</p>
                    <p className="text-gray-600">Initiator sends final message with timestamps</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-1"></div>
                  <div>
                    <p className="font-medium">4. Distance Calculation</p>
                    <p className="text-gray-600">Distance = (Round Trip Time × Speed of Light) / 2</p>
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