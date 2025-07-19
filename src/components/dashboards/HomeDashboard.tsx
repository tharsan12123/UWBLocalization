import React, { useEffect, useRef, useState } from 'react';
import { Radio, Clock, Target, Zap, Brain, BarChart, Check, MapPin, Shield, Cpu, ChevronRight, Bookmark } from 'lucide-react';
import { LocalizationMethod } from '../../App';

const videoSources = ['/uwb_bg1.mp4', '/uwb_bg2.mp4', '/uwb_bg3.mp4'];

export const HomeDashboard: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const randomStartIndex = Math.floor(Math.random() * videoSources.length);
    setCurrentIndex(randomStartIndex);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setFade(true); // start fade out
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % videoSources.length);
        setFade(false); // fade in after switching video
      }, 1000);
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [currentIndex]);

  const technologies = [
    { name: "Ultra-Wideband Radio", icon: Radio, description: "High-bandwidth wireless technology for precise ranging" },
    { name: "TDOA Positioning", icon: Clock, description: "Time Difference of Arrival for multi-anchor positioning" },
    { name: "Angle of Arrival", icon: Target, description: "Direction-based positioning with phase difference analysis" },
    { name: "Kalman Filtering", icon: Zap, description: "Advanced algorithm for motion tracking and noise reduction" },
    { name: "Machine Learning", icon: Brain, description: "Neural networks that enhance positioning accuracy" },
    { name: "Real-time Visualization", icon: BarChart, description: "Interactive 3D visualization of positioning data" }
  ];

  const benefits = [
    "Sub-centimeter accuracy in indoor environments",
    "Reliable performance in non-line-of-sight conditions",
    "Low power consumption for extended tag battery life",
    "Scalable from small spaces to large industrial facilities",
    "Real-time position updates with minimal latency",
    "Integration with existing building management systems"
  ];

  const applications = [
    {
      title: "Asset Tracking",
      icon: Bookmark,
      description: "Track high-value assets in hospitals, warehouses, and manufacturing facilities with centimeter-level precision."
    },
    {
      title: "Indoor Navigation",
      icon: MapPin,
      description: "Enable wayfinding in complex indoor environments like airports, shopping malls, and large office buildings."
    },
    {
      title: "Robotics & Automation",
      icon: Cpu,
      description: "Provide precise positioning data for autonomous robots, drones, and automated guided vehicles."
    },
    {
      title: "Safety & Security",
      icon: Shield,
      description: "Monitor restricted areas, track personnel in hazardous environments, and enhance emergency response."
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden" id="hero">
        {/* Video Background */}
        <video
          key={videoSources[currentIndex]} // ensures reload
          ref={videoRef}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${fade ? 'opacity-0' : 'opacity-100'}`}
          autoPlay
          muted
          playsInline
        >
          <source src={videoSources[currentIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-black/70 to-blue-900/50 z-10" />

        {/* Centered Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4 pt-16">
          <div className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full mb-6">
            Next-Generation Indoor Positioning
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            UWB Indoor <span className="text-blue-400">Localization</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-10 drop-shadow-md">
            High-precision, real-time positioning using cutting-edge Ultra-Wideband technology
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#technologies"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition shadow-lg hover:shadow-xl"
            >
              Explore Features
            </a>
            <a
              href="#demo"
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-medium transition shadow-lg hover:shadow-xl"
            >
              Watch Demo
            </a>
          </div>

          <div className="absolute bottom-12 w-full flex justify-center animate-bounce">
            <a href="#technologies" className="text-white">
              <ChevronRight size={40} className="rotate-90" />
            </a>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <section id="technologies" className="py-24 px-4 bg-gradient-to-b from-gray-100 to-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Technologies</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our system combines cutting-edge technologies to deliver unparalleled indoor positioning accuracy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow border-t-4 border-blue-500"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-lg mb-6 flex items-center justify-center">
                  <tech.icon size={28} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{tech.name}</h3>
                <p className="text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">System Benefits</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Why our UWB Localization System outperforms other indoor positioning technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="bg-blue-600 rounded-full p-1 mt-1 flex-shrink-0">
                  <Check size={16} className="text-white" />
                </div>
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Applications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our UWB localization system can be deployed across a wide range of industries and use cases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {applications.map((app, index) => (
              <div 
                key={index} 
                className="flex bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-24 bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <app.icon size={32} className="text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{app.title}</h3>
                  <p className="text-gray-600">{app.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section with improved styling */}
      <section id="demo" className="py-24 px-4 bg-gray-900 text-white scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Watch how our UWB system performs in real indoor environments with dynamic tag movements
            </p>
          </div>
          
          <div className="bg-gray-800 p-2 rounded-xl shadow-2xl overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="UWB Localization System Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <a
              href="#contact"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition shadow-lg hover:shadow-xl"
            >
              <span>Request a Demo</span>
              <ChevronRight size={20} className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-5xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Indoor Positioning?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Contact us today to learn how our UWB localization system can address your specific needs
            with tailored solutions and expert implementation.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => document.dispatchEvent(new CustomEvent('navigate', { detail: { method: 'contact' as LocalizationMethod } }))}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold transition shadow-lg hover:shadow-xl"
            >
              Contact Us
            </button>
            <button
              onClick={() => document.dispatchEvent(new CustomEvent('navigate', { detail: { method: 'about' as LocalizationMethod } }))}
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-bold transition"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
