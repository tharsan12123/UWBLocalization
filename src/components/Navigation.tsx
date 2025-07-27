import React, { useState, useEffect } from 'react';
import { LocalizationMethod } from '../App';
import { Home, Radio, User, Users, Info, Phone, Menu, X } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface NavigationProps {
  activeMethod: LocalizationMethod;
  onMethodChange: (method: LocalizationMethod) => void;
  isTransparent?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeMethod, 
  onMethodChange,
  isTransparent = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Toggle scrolled state based on scroll position
      // When scrolled down more than 100px, set scrolled to true
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Dynamic classes based on scroll position and isTransparent prop
  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isTransparent
      ? scrolled
        ? 'bg-white/95 backdrop-blur-sm shadow-lg'
        : 'bg-white/10 backdrop-blur-sm'
      : 'bg-white shadow-lg border-b border-gray-200'
  }`;

  // Text color classes based on transparency and scroll
  const textColorClass = isTransparent && !scrolled ? 'text-white' : 'text-gray-900';
  const logoColorClass = isTransparent && !scrolled ? 'text-white' : 'text-blue-600';
  const menuButtonClass = isTransparent && !scrolled ? 'text-white' : 'text-gray-700';
  const navItemActiveClass = isTransparent && !scrolled 
    ? 'bg-white/20 text-white' 
    : 'bg-blue-600 text-white shadow-md';
  const navItemInactiveClass = isTransparent && !scrolled
    ? 'text-white hover:bg-white/10'
    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600';

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Website Name */}
          <div className="flex items-center space-x-2">
            <Radio className={`h-8 w-8 ${isTransparent && !scrolled ? 'text-white' : 'text-blue-600'}`} />
            <h1 className={`text-xl font-bold ${isTransparent && !scrolled ? 'text-white' : 'text-gray-900'}`}>UWB Localization System</h1>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className={`${isTransparent && !scrolled ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-blue-600'} focus:outline-none`}
            >
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
                    ? (isTransparent && !scrolled 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-600 text-white shadow-md')
                    : (isTransparent && !scrolled
                        ? 'text-white hover:bg-white/10'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
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
          <div className={`md:hidden py-2 pb-4 ${isTransparent && !scrolled ? 'border-t border-white/20 bg-white/25 backdrop-blur-md' : 'border-t border-gray-200 bg-white'}`}>
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
                    ? (isTransparent && !scrolled 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-600 text-white')
                    : (isTransparent && !scrolled
                        ? 'text-white hover:bg-white/10' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600')
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
