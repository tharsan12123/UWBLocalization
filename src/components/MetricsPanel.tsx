import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
  icon: LucideIcon;
}

interface MetricsPanelProps {
  metrics: Metric[];
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-base font-semibold mb-3">Live Metrics</h3>
      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <metric.icon className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{metric.label}</p>
                <p className="text-sm font-bold text-blue-600">{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};