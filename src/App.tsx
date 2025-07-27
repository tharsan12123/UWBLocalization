import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomeDashboard } from './components/dashboards/HomeDashboard';
import { TwrDashboard } from './components/dashboards/TwrDashboard';
import { TdoaDashboard } from './components/dashboards/TdoaDashboard';
import { TdoaKalmanDashboard } from './components/dashboards/TdoaKalmanDashboard';
import { TdoaMlDashboard } from './components/dashboards/TdoaMlDashboard';
import { AoaDashboard } from './components/dashboards/AoaDashboard';
import { SinglePointDashboard } from './components/dashboards/SinglePointDashboard';
import { MultiPointDashboard } from './components/dashboards/MultiPointDashboard';
import { AboutUsDashboard } from './components/dashboards/AboutUsDashboard';
import { ContactUsDashboard } from './components/dashboards/ContactUsDashboard';

// ✅ Add 'about' and 'contact' to your type
export type LocalizationMethod = 'home' | 'single-point' | 'multi-point' | 'twr' | 'tdoa' | 'tdoa-kalman' | 'tdoa-ml' | 'aoa' | 'about' | 'contact';

function App() {
  const [activeMethod, setActiveMethod] = useState<LocalizationMethod>('home'); // ✅ default to home

  useEffect(() => {
    // Listen for navigation events from the dashboard components
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<{ method: LocalizationMethod }>;
      if (customEvent.detail && customEvent.detail.method) {
        setActiveMethod(customEvent.detail.method);
        window.scrollTo(0, 0); // Scroll to top when changing pages
      }
    };

    document.addEventListener('navigate', handleNavigate);

    return () => {
      document.removeEventListener('navigate', handleNavigate);
    };
  }, []);

  const renderDashboard = () => {
    switch (activeMethod) {
      case 'home':
        return <HomeDashboard />;
      case 'single-point':
        return <SinglePointDashboard />;
      case 'multi-point':
        return <MultiPointDashboard />;
      case 'about':
        return <AboutUsDashboard />;
      case 'contact':
        return <ContactUsDashboard />;
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
    <div className={`min-h-screen flex flex-col ${activeMethod === 'home' ? 'bg-black' : 'bg-gray-50'}`}>
      <Navigation 
        activeMethod={activeMethod} 
        onMethodChange={setActiveMethod} 
        isTransparent={activeMethod === 'home'} 
      />
      <main className={`flex-grow ${activeMethod === 'home' ? 'pt-0' : 'pt-20'}`}>
        {renderDashboard()}
      </main>
      <Footer onMethodChange={setActiveMethod} />
    </div>
  );
}

export default App;
