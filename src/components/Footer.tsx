import React from 'react';
import { Home, User, Users, Info, Phone, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { LocalizationMethod } from '../App';

interface FooterProps {
  onMethodChange: (method: LocalizationMethod) => void;
}

export const Footer: React.FC<FooterProps> = ({ onMethodChange }) => {
  const currentYear = new Date().getFullYear();
  
  const mainLinks = [
    { name: 'Home', method: 'home' as LocalizationMethod, icon: Home },
    { name: 'Single Point', method: 'single-point' as LocalizationMethod, icon: User },
    { name: 'Multi Point', method: 'multi-point' as LocalizationMethod, icon: Users },
    { name: 'About Us', method: 'about' as LocalizationMethod, icon: Info },
    { name: 'Contact Us', method: 'contact' as LocalizationMethod, icon: Phone }
  ];

  const resources = [
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
    { name: 'Research Papers', href: '#' },
    { name: 'GitHub Repository', href: '#' }
  ];

  const socialLinks = [
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Twitter', href: '#', icon: Twitter }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">UL</span>
              </div>
              <h3 className="text-xl font-bold text-white">UWB Localization</h3>
            </div>
            <p className="text-sm">
              Pioneering next-generation indoor positioning technology with sub-centimeter accuracy
              using Ultra-Wideband radio technology enhanced by machine learning algorithms.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={link.name}
                >
                  <link.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              {mainLinks.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => onMethodChange(link.method)} 
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <link.icon size={16} />
                    <span>{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <a 
                    href={resource.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                <span>info@uwblocalization.tech</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3 mt-4">
                <button 
                  onClick={() => onMethodChange('contact')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Get in Touch
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} UWB Localization System. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
