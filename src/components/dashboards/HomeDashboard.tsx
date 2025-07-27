import React, { useEffect, useRef, useState } from 'react';
import { Radio, Clock, Target, Zap, Brain, BarChart, Check, MapPin, Shield, Cpu, ChevronRight, Bookmark } from 'lucide-react';
import { LocalizationMethod } from '../../App';

const videoSources = ['/Tharsan.mp4'];

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
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Two Way Ranging(TWR) </h3>
            <p className="mb-4">
              <b>TWR</b> is a method where two UWB devices exchange messages to measure the round-trip time of signals. By calculating the time it takes for a signal to travel to a responder and back, the distance between devices can be determined with high precision.
            </p>
            <p>
              <b>TWR-based indoor localization</b> involves a mobile tag performing TWR with multiple fixed anchors. By measuring distances to several anchors, the tag's position can be estimated using trilateration. TWR is simple, robust, and well-suited for scenarios with a moderate number of devices.
            </p>
          </div>

          {/* TDOA Introduction */}
          <div id="tdoa" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Time Difference of Arrival(TDOA) </h3>
            <p className="mb-4">
              <b>TDOA</b> is a technique where a tag transmits a signal received by multiple anchors. Each anchor records the arrival time, and the differences in arrival times are used to compute the tag's position.
            </p>
            <p>
              <b>TDOA-based indoor localization</b> enables real-time tracking of many tags simultaneously, as tags only need to transmit and do not require two-way communication. This method is highly scalable and suitable for large deployments.
            </p>
          </div>

          {/* Placeholders for new sections */}
          <div id="aoa" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Angle of Arrival (AOA)</h3>
            <p className="mb-4">
              AOA is a technique used to determine the direction from which a signal arrives at a receiver. In our system, we utilize time difference measurements between anchors to estimate the angle. This allows us to calculate the bearing line along which the tag must lie.
            </p>
            <p className="mb-4">
              An AOA measurement <b>&theta;</b> (relative to the baseline midpoint <b>M = (A<sub>0</sub> + A<sub>1</sub>)/2</b>) tells you the tag lies on the ray:
            </p>
            <div className="bg-gray-50 rounded p-4 my-4 text-center">
              <span className="text-lg font-mono">
                P(t) = M + t&nbsp;
                <span style={{ fontFamily: 'serif' }}>
                  (
                  <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                    <span style={{ borderRight: '1px solid #333', paddingRight: 4 }}>sinθ</span>
                    <span style={{ paddingLeft: 4 }}>cosθ</span>
                  </span>
                  )
                </span>
                , &nbsp; t ≥ 0
              </span>
            </div>
            <p>
              This means the tag's position is constrained to a straight line originating from the midpoint between the anchors, extending in the direction of the measured angle.
            </p>
            {/* Stylish image card */}
            <div className="mt-10 flex justify-center">
              <div className="relative group w-full max-w-md">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 via-pink-200 to-purple-400 opacity-30 blur-lg group-hover:opacity-50 transition"></div>
                <img
                  src="/aoa_arrow.png"
                  alt="AOA Arrow Graph"
                  className="relative z-10 w-full rounded-xl shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/80 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold shadow group-hover:bg-blue-100 transition">
                  AOA Visualization
                </div>
              </div>
            </div>
          </div>
          <div id="sync" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Synchronizations</h3>
            <p className="mb-4">
              Synchronization is essential for accurate indoor localization, ensuring that all anchors share a common time reference. There are two main synchronization methods: <b>wired</b> and <b>wireless</b>. In this project, we use the wireless method because it is more feasible and user-friendly, and it supports both single-point and multi-point localization setups.
            </p>
            <p className="mb-4">
              Wireless synchronization can be implemented in two ways:
              <ul className="list-disc pl-6 my-2">
                <li>
                  <b>Continuous Periodic Pulse Method:</b> Anchors synchronize using regular timing pulses. This method is illustrated in the figure below, where a master anchor periodically broadcasts its local time to slave anchors, which record the time of arrival (ToA) and synchronize accordingly.
                  <div className="mt-4 flex justify-center">
                    <img
                      src="/sync_method.png"
                      alt="Wireless Synchronization Methodology"
                      className="w-full max-w-xl rounded-xl shadow-lg border-4 border-white"
                    />
                  </div>
                  <div className="text-center text-gray-500 text-sm mt-2">
                    Wireless synchronization methodology: Master anchor broadcasts local time, slave anchors record ToA.
                  </div>
                </li>
                <li className="mt-8">
                  <b>Offset Method:</b> Anchors synchronize by exchanging packets containing their local time and calculating the time offset between devices. In our system, we use the offset method because it offers better accuracy and reliability compared to the periodic pulse method.
                  <div className="mt-4 flex justify-center">
                    <img
                      src="/Smart Indoor Tracking with UWB.png"
                      alt="Offset Synchronization Example"
                      className="w-full max-w-xl rounded-xl shadow-lg border-4 border-white"
                    />
                  </div>
                  <div className="text-center text-gray-500 text-sm mt-2">
                    Offset synchronization example: Smart indoor tracking with UWB.
                  </div>
                </li>
              </ul>
            </p>
            <p className="mt-6">
              By using wireless offset synchronization, our system achieves robust and scalable time alignment across all anchors, enabling precise localization in dynamic environments.
            </p>
          </div>
          <div id="multi-anchor" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Multi Anchor Setup</h3>
            <p className="mb-4">
              Our multi-anchor setup is designed to provide reasonable accuracy for indoor localization while maintaining low power consumption. In this configuration, three base stations (anchors) are deployed within the environment. The target device transmits signals that are received by all three anchors, allowing the system to use time difference of arrival (TDOA) techniques for position estimation.
            </p>
            <p className="mb-4">
              The process involves three main steps:
              <ol className="list-decimal pl-6 my-2">
                <li><b>Communication:</b> The target transmits a signal, which is received by three base stations.</li>
                <li><b>Time Difference Calculation:</b> The system calculates the arrival time differences between pairs of anchors.</li>
                <li><b>Hyperbola Creation & Target Location:</b> Each time difference pair creates a hyperbola, and the intersection of these hyperbolas determines the target's location.</li>
              </ol>
            </p>
            <div className="mt-8 flex justify-center">
              <div className="relative w-full max-w-xl">
                <img
                  src="/multi_point.png"
                  alt="Multi Anchor Setup Illustration"
                  className="w-full rounded-xl shadow-lg border-4 border-white"
                />
                <div className="text-center text-gray-500 text-sm mt-2">
                  Multi-point localization with three anchors: Communication, time difference calculation, and hyperbola intersection for reasonable accuracy and low power consumption.
                </div>
              </div>
            </div>
            <p className="mt-6">
              This approach is well-suited for practical indoor environments where energy efficiency and reliable tracking are essential.
            </p>
          </div>
          <div id="single-anchor" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Single Point Setup</h3>
            <p className="mb-4">
              In our single point setup, we use <b>wireless synchronization</b> to align timing across all modules. Specifically, we deploy <b>three UWB modules</b>:
              <ul className="list-disc pl-6 my-2">
                <li><b>Two modules</b> are used to determine the Angle of Arrival (AoA) of the tag signal.</li>
                <li><b>One module</b> is used to find the hyperbola using Time Difference of Arrival (TDOA), which helps estimate the tag's position.</li>
              </ul>
              This combination of AoA and TDOA enables reasonable accuracy for indoor localization while maintaining low power consumption.
            </p>
            <p>
              The single point setup is suitable for scenarios where deploying multiple anchors is challenging, and it offers a cost-effective solution for accurate indoor tracking.
            </p>
          </div>
          <div id="chan-est" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Channel Estimation</h3>
            <p className="mb-4">
              Channel estimation is a crucial process in UWB localization systems. It allows the receiver to accurately interpret the transmitted signal by analyzing the channel impulse response, which helps distinguish the direct path from reflected signals. Advanced algorithms, such as the Chan algorithm, are used to mitigate errors caused by multipath propagation and non-line-of-sight conditions. Effective channel estimation improves the reliability and precision of indoor positioning, especially in environments with obstacles and interference.
            </p>
            <p>
              For more details, see: <a href="https://en.wikipedia.org/wiki/Channel_estimation" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Channel Estimation (Wikipedia)</a>
            </p>
          </div>

          <div id="kalman" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Kalman Improvement</h3>
            <p className="mb-4">
              The Kalman filter is widely used in UWB localization to improve the accuracy of position estimates, especially for moving tags. It combines real-time sensor measurements with a predictive model to filter out noise and compensate for measurement errors. By continuously updating the position estimate as new data arrives, the Kalman filter enables smooth and reliable tracking with centimeter-level accuracy. This approach is particularly effective for dynamic applications such as robotics and asset tracking.
            </p>
            <p>
              Learn more: <a href="https://en.wikipedia.org/wiki/Kalman_filter" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Kalman Filter (Wikipedia)</a>
            </p>
          </div>
          <div id="ml" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">ML Effect</h3>
            <p className="mb-4">
              Machine learning (ML) techniques are increasingly used in UWB localization to enhance accuracy and robustness. ML models can learn complex patterns from signal data, compensate for environmental changes, and improve localization in challenging scenarios. Algorithms such as Gradient Boosting Machines (GBM) and neural networks are used to refine position estimates and reduce errors. Integrating ML with traditional localization methods enables adaptive and intelligent indoor positioning solutions. In our project, we used a Gradient Boosting ML model because it is lightweight and easy to deploy on a server for real-time usage, compared to neural networks.
            </p>
            {/* <p>
              Explore the potential of ML in localization: <a href="https://en.wikipedia.org/wiki/Machine_learning" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Machine Learning (Wikipedia)</a>
            </p> */}
          </div>
          <div id="accuracy" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Accuracy Comparison</h3>
            <p className="mb-4">
              UWB localization systems offer superior accuracy compared to traditional indoor positioning technologies such as Wi-Fi, Bluetooth, and RFID. With advanced algorithms like TDOA, AoA, and Kalman filtering, UWB can achieve sub-meter or even centimeter-level precision. In our project, static tag localization using Gradient Boosting Machine (GBM) achieved 92.4% accuracy with a 40 cm error, while dynamic tag localization with Kalman filtering reached centimeter-level accuracy. This high precision makes UWB ideal for applications requiring reliable and detailed location data.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>UWB (with ML/Kalman): up to centimeter-level accuracy</li>
              <li>Wi-Fi/Bluetooth: typically 1-5 meters accuracy</li>
              <li>RFID: typically 1-10 meters accuracy</li>
            </ul>
            <p>
              The choice of algorithm and system configuration directly impacts the achievable accuracy in different environments.
            </p>
          </div>
          <div id="scalability" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Scalability</h3>
            <p className="mb-4">
              Scalability is a key advantage of UWB localization systems. Our solution supports both single-point and multi-point setups, allowing easy expansion from small rooms to large facilities. Wireless synchronization and efficient algorithms enable the addition of more anchors and tags without significant loss of performance or increase in power consumption. The system can handle multiple simultaneous tags and anchors, making it suitable for industrial, commercial, and healthcare environments.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Flexible deployment: add more anchors for larger coverage</li>
              <li>Supports high tag density and real-time tracking</li>
              <li>Low power consumption for scalable, long-term operation</li>
            </ul>
            <p>
              This scalability ensures that the UWB localization system can grow with your needs, from small-scale projects to enterprise-level solutions.
            </p>
          </div>
          <div id="power" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
            {/* <h3 className="text-2xl font-semibold text-blue-700 mb-3"></h3>
            <p></p> */}
          </div>
          <div id="power" className="mb-12 max-w-4xl mx-auto text-lg text-gray-700 bg-white rounded-xl shadow p-8">
  <h3 className="text-2xl font-semibold text-blue-700 mb-3">Power Consumption</h3>
  <p className="mb-4">
    The power consumption of the UWB localization system was analyzed using both STM32F103 and DWM1000 modules.
    The tag operates every 3 seconds, transmitting for a short burst and then entering a low-power sleep mode.
  </p>

  <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-2">📊 Daily Power Usage Comparison</h4>
  <table className="w-full text-left border-collapse text-sm mb-4">
    <thead>
      <tr className="bg-blue-100">
        <th className="border p-2">Component</th>
        <th className="border p-2">Power (Wh/day)</th>
        <th className="border p-2">% of Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border p-2">STM32F103</td>
        <td className="border p-2">0.16035</td>
        <td className="border p-2">97.72%</td>
      </tr>
      <tr>
        <td className="border p-2">DWM1000 (TDOA/AOA)</td>
        <td className="border p-2">0.003739</td>
        <td className="border p-2">2.28%</td>
      </tr>
      <tr className="bg-green-50 font-semibold">
        <td className="border p-2">Total</td>
        <td className="border p-2">0.1641</td>
        <td className="border p-2">100%</td>
      </tr>
    </tbody>
  </table>

  <p className="mb-2">
    For a 1000 mAh, 3.7 V battery, this setup can operate for approximately <strong>22 days</strong> continuously.
    Notably, the DW1000 module contributes only about <strong>2.3%</strong> to total consumption, making it
    highly power efficient.
  </p>

  <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-2">🔁 TWR vs TDOA/AOA Method</h4>
  <p className="mb-2">
    When using the TWR method (2 transmissions and 1 reception per cycle), power consumption increases to
    <strong>0.01166 Wh/day</strong>, which is almost <strong>3x higher</strong> than the optimized TDOA/AOA method.
  </p>

  <p className="mb-2">
    <span className="font-semibold text-green-700">Power Reduction:</span> TDOA/AOA reduces UWB power usage by <strong>≈68%</strong> compared to TWR.
  </p>

  <p className="mt-4 italic text-sm text-gray-500">
    Calculations are based on 3-second cycle intervals, 28800 transmissions/day, and measured datasheet values.
  </p>
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