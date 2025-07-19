import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomeDashboard } from './components/dashboards/HomeDashboard';
import { TwrDashboard } from './components/dashboards/TwrDashboard';
import { TdoaDashboard } from './components/dashboards/TdoaDashboard';
import { TdoaKalmanDashboard } from './components/dashboards/TdoaKalmanDashboard';
import { TdoaMlDashboard } from './components/dashboards/TdoaMlDashboard';
import { AoaDashboard } from './components/dashboards/AoaDashboard';

// ✅ Add 'home' to your type
export type LocalizationMethod = 'home' | 'twr' | 'tdoa' | 'tdoa-kalman' | 'tdoa-ml' | 'aoa';

function App() {
  const [activeMethod, setActiveMethod] = useState<LocalizationMethod>('home'); // ✅ default to home

  const renderDashboard = () => {
    switch (activeMethod) {
      case 'home':
        return <HomeDashboard />;
      case 'twr':
        return <TwrDashboard />;
      case 'tdoa':
        return <TdoaDashboard />;
      case 'tdoa-kalman':
        return <TdoaKalmanDashboard />;
      case 'tdoa-ml':
        return <TdoaMlDashboard />;
      case 'aoa':
        return <AoaDashboard />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeMethod={activeMethod} onMethodChange={setActiveMethod} />
      <main className="container mx-auto px-4 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
}

export default App;
