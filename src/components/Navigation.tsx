import React, { useState } from 'react';
import { LocalizationMethod } from '../App';
import { Home, Radio, User, Users, Info, Phone, Menu, X } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface NavigationProps {
  activeMethod: LocalizationMethod;
  onMethodChange: (method: LocalizationMethod) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeMethod, onMethodChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems: NavItem[] = [
    { id: 'home' as LocalizationMethod, label: 'Home', icon: Home },
    { id: 'single-point' as LocalizationMethod, label: 'Single Point', icon: User },
    { id: 'multi-point' as LocalizationMethod, label: 'Multi Point', icon: Users },
    { id: 'about' as LocalizationMethod, label: 'About Us', icon: Info },
    { id: 'contact' as LocalizationMethod, label: 'Contact Us', icon: Phone },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Website Name */}
          <div className="flex items-center space-x-2">
            <Radio className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">UWB Localization System</h1>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 focus:outline-none">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick || (() => {
                  if (typeof item.id === 'string' && ['home', 'single-point', 'multi-point', 'about', 'contact'].includes(item.id)) {
                    onMethodChange(item.id as LocalizationMethod);
                  }
                })}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${activeMethod === item.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }
                `}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-2 pb-4 border-t border-gray-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  else if (typeof item.id === 'string' && ['home', 'single-point', 'multi-point', 'about', 'contact'].includes(item.id)) {
                    onMethodChange(item.id as LocalizationMethod);
                  }
                  setIsMenuOpen(false);
                }}
                className={`
                  flex items-center space-x-2 px-4 py-3 w-full
                  ${activeMethod === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }
                `}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
