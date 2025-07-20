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

  // Smooth scroll handler
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

          {/* Key Sections Button Group */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: 'uwb', label: 'UWB Intro' },
              { id: 'twr', label: 'TWR Intro' },
              { id: 'tdoa', label: 'TDOA Intro' },
              { id: 'aoa', label: 'AOA' },
              { id: 'sync', label: 'Synchronizations' },
              { id: 'multi-anchor', label: 'Multi Anchor Setup' },
              { id: 'single-anchor', label: 'Single Anchor Setup' },
              { id: 'chan-est', label: 'Chan Estimation' },
              { id: 'kalman', label: 'Kalman Improvement' },
              { id: 'ml', label: 'ML Effect' },
              { id: 'accuracy', label: 'Accuracy Comparison' },
              { id: 'scalability', label: 'Scalability' },
              { id: 'power', label: 'Power Consumption' },
              { id: 'applications', label: 'Applications' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => handleScroll(btn.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition"
                type="button"
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* UWB Introduction and Comparison */}
          <div id="uwb" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">What is Ultra-Wideband (UWB)?</h3>
            <p className="mb-4">
              Ultra-Wideband (UWB) is a radio technology that uses very short pulses over a wide frequency spectrum, enabling highly accurate distance measurements and robust wireless communication. Unlike traditional wireless technologies such as Wi-Fi, Bluetooth, or Zigbee, UWB offers:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Superior ranging accuracy (often sub-10cm) due to its wide bandwidth</li>
              <li>High resistance to multipath and interference, making it ideal for complex indoor environments</li>
              <li>Low power consumption, suitable for battery-powered tags and devices</li>
              <li>Minimal impact from obstacles and non-line-of-sight conditions</li>
            </ul>
            <p>
              These advantages make UWB the preferred choice for next-generation indoor localization, outperforming conventional wireless solutions in precision and reliability.
            </p>

            {/* UWB Image at the end, full width */}
            <div className="mt-8">
              <img
                src="/UWB.jpeg"
                alt="Ultra-Wideband Illustration"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>

          {/* TWR Introduction */}
          <div id="twr" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Two Way Ranging (TWR) & TWR-based Indoor Localization</h3>
            <p className="mb-4">
              <b>Two Way Ranging (TWR)</b> is a method where two UWB devices exchange messages to measure the round-trip time of signals. By calculating the time it takes for a signal to travel to a responder and back, the distance between devices can be determined with high precision.
            </p>
            <p>
              <b>TWR-based indoor localization</b> involves a mobile tag performing TWR with multiple fixed anchors. By measuring distances to several anchors, the tag's position can be estimated using trilateration. TWR is simple, robust, and well-suited for scenarios with a moderate number of devices.
            </p>
          </div>

          {/* TDOA Introduction */}
          <div id="tdoa" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Time Difference of Arrival (TDOA) & TDOA-based Indoor Localization</h3>
            <p className="mb-4">
              <b>Time Difference of Arrival (TDOA)</b> is a technique where a tag transmits a signal received by multiple anchors. Each anchor records the arrival time, and the differences in arrival times are used to compute the tag's position.
            </p>
            <p>
              <b>TDOA-based indoor localization</b> enables real-time tracking of many tags simultaneously, as tags only need to transmit and do not require two-way communication. This method is highly scalable and suitable for large deployments.
            </p>
          </div>

          {/* Placeholders for new sections */}
          <div id="aoa" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Angle of Arrival (AOA)</h3>
            <p>Details about AOA will go here.</p>
          </div>
          <div id="sync" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Synchronizations</h3>
            <p>Details about synchronization methods will go here.</p>
          </div>
          <div id="multi-anchor" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Multi Anchor Setup</h3>
            <p>Details about multi anchor setup will go here.</p>
          </div>
          <div id="single-anchor" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Single Anchor Setup</h3>
            <p>Details about single anchor setup will go here.</p>
          </div>
          <div id="chan-est" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Channel Estimation</h3>
            <p>Details about channel estimation will go here.</p>
          </div>
          <div id="kalman" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Kalman Improvement</h3>
            <p>Details about Kalman improvement will go here.</p>
          </div>
          <div id="ml" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">ML Effect</h3>
            <p>Details about machine learning effect will go here.</p>
          </div>
          <div id="accuracy" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Accuracy Comparison</h3>
            <p>Details about accuracy comparison will go here.</p>
          </div>
          <div id="scalability" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Scalability</h3>
            <p>Details about scalability will go here.</p>
          </div>
          <div id="power" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Power Consumption</h3>
            <p>Details about power consumption will go here.</p>
          </div>

          {/* Remaining features as cards */}
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
      <section id="applications" className="py-24 px-4 bg-white">
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