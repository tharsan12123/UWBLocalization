import React, { useEffect, useRef, useState } from 'react';

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

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[90vh] overflow-hidden" id="hero">
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
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-10" />

        {/* Centered Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            UWB Indoor Localization System
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md">
            Real-time positioning using cutting-edge UWB + TDOA + ML + AoA technologies
          </p>

          <div className="space-x-4">
            <a
              href="#features"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Explore Features
            </a>
            <a
              href="#demo"
              className="bg-white hover:bg-gray-200 text-blue-600 px-6 py-3 rounded-lg font-medium transition"
            >
              Watch Demo
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-lg text-gray-600">Explore the powerful capabilities of our UWB-based system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="/feature1.jpg" alt="TDOA Module" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Precise TDOA Tracking</h3>
              <p className="text-gray-600">High-resolution time difference measurement for sub-meter accuracy.</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="/feature2.jpg" alt="ML Enhanced" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">ML-Assisted Localization</h3>
              <p className="text-gray-600">Machine learning models help refine tag positions and reduce errors.</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="/feature3.jpg" alt="Real Setup" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Real-Time Dashboard</h3>
              <p className="text-gray-600">Live monitoring, tag movement visualization, and system metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Live Demo</h2>
          <p className="text-lg text-gray-700 mb-8">
            Watch how our UWB system performs in real indoor environments with anchor and tag movements.
          </p>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-96 rounded-lg shadow-lg"
              src="https://www.youtube.com/embed/VIDEO_ID"
              title="Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};
