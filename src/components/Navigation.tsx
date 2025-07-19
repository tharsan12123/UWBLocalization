import React from 'react';
import { LocalizationMethod } from '../App';
import { Home, Radio, Timer, Brain, Target, Zap } from 'lucide-react';

interface NavigationProps {
  activeMethod: LocalizationMethod;
  onMethodChange: (method: LocalizationMethod) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeMethod, onMethodChange }) => {
  const methods = [
    { id: 'home' as LocalizationMethod, label: 'Home', icon: Home, description: 'Overview & Media' },
    { id: 'twr' as LocalizationMethod, label: 'TWR', icon: Radio, description: 'Two-Way Ranging' },
    { id: 'tdoa' as LocalizationMethod, label: 'TDOA', icon: Timer, description: 'Time Difference of Arrival' },
    { id: 'tdoa-kalman' as LocalizationMethod, label: 'TDOA + Kalman', icon: Target, description: 'TDOA with Kalman Filter' },
    { id: 'tdoa-ml' as LocalizationMethod, label: 'TDOA + ML', icon: Brain, description: 'TDOA with Machine Learning' },
    { id: 'aoa' as LocalizationMethod, label: 'AOA', icon: Zap, description: 'Angle of Arrival' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Radio className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">UWB Localization System</h1>
          </div>
          
          <div className="flex space-x-1">
            {methods.map(({ id, label, icon: Icon, description }) => (
              <button
                key={id}
                onClick={() => onMethodChange(id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${activeMethod === id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }
                `}
                title={description}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
