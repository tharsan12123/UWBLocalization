import React from 'react';
import { Info, Radio, Cpu, Layers, Zap, Clock, Target, BarChart } from 'lucide-react';

export const AboutUsDashboard: React.FC = () => {
  const teamMembers = [
    {
      name: "Dr. Jane Smith",
      role: "Project Lead",
      bio: "PhD in Electrical Engineering with 10+ years experience in positioning systems",
      image: "https://randomuser.me/api/portraits/women/23.jpg"
    },
    {
      name: "Alex Johnson",
      role: "Hardware Engineer",
      bio: "Specializes in UWB antenna design and RF signal processing",
      image: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    {
      name: "Maria Rodriguez",
      role: "Machine Learning Expert",
      bio: "Developed the ML algorithms that enhance localization accuracy",
      image: "https://randomuser.me/api/portraits/women/53.jpg"
    },
    {
      name: "David Chen",
      role: "Software Developer",
      bio: "Created the real-time visualization platform for UWB data",
      image: "https://randomuser.me/api/portraits/men/76.jpg"
    }
  ];

  const technologies = [
    { name: "Ultra-Wideband", icon: Radio, description: "Low-power radio technology for precise indoor positioning" },
    { name: "Time Difference of Arrival", icon: Clock, description: "Localization technique based on signal arrival time differences" },
    { name: "Angle of Arrival", icon: Target, description: "Direction-based positioning using signal phase differences" },
    { name: "Kalman Filtering", icon: Zap, description: "Advanced algorithm for motion tracking and noise reduction" },
    { name: "Machine Learning", icon: Cpu, description: "AI techniques for improving positioning accuracy" },
    { name: "Data Visualization", icon: BarChart, description: "Interactive 3D visualization of real-time location data" }
  ];

  const researchPapers = [
    {
      title: "Enhanced Indoor Positioning Using UWB and Kalman Filtering",
      authors: "Smith J., Johnson A., et al.",
      conference: "IEEE International Conference on Indoor Positioning, 2024",
      link: "#"
    },
    {
      title: "Machine Learning Approaches for UWB Signal Processing in Complex Environments",
      authors: "Rodriguez M., Chen D., et al.",
      conference: "Journal of Location Based Services, Vol. 18, 2024",
      link: "#"
    },
    {
      title: "Comparative Analysis of TWR, TDOA, and AOA Techniques for Indoor Localization",
      authors: "Johnson A., Smith J., et al.",
      conference: "International Symposium on Wearable Computers, 2023",
      link: "#"
    }
  ];

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">About UWB Localization System</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Pioneering next-generation indoor positioning technology with sub-centimeter accuracy
          </p>
        </div>
      </div>

      {/* Project Overview */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-start space-x-4 mb-6">
          <Info className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h2>
            <p className="text-gray-700 mb-4">
              The UWB Localization System is a cutting-edge research initiative focused on developing highly accurate 
              indoor positioning technology using Ultra-Wideband (UWB) radio signals. Our system achieves positioning 
              accuracy of up to 10cm in complex indoor environments where GPS typically fails.
            </p>
            <p className="text-gray-700 mb-4">
              Leveraging multiple positioning methodologies including Two-Way Ranging (TWR), Time Difference of Arrival 
              (TDOA), and Angle of Arrival (AOA), our system provides robust performance across various scenarios. 
              We've further enhanced accuracy and reliability through advanced signal processing techniques including 
              Kalman filtering and machine learning algorithms.
            </p>
            <p className="text-gray-700">
              This visualization platform allows for real-time monitoring and analysis of positioning data, providing 
              valuable insights for research and practical applications in fields ranging from robotics and automation 
              to healthcare and smart buildings.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Layers className="h-7 w-7 text-blue-600 mr-3" />
          Technology Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <tech.icon className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">{tech.name}</h3>
              </div>
              <p className="text-gray-700">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Research Team */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Research Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="aspect-w-1 aspect-h-1">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="object-cover w-full h-64"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                <p className="text-gray-700 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Research Papers */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Published Research</h2>
        <div className="space-y-4">
          {researchPapers.map((paper, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="text-lg font-semibold text-gray-900">{paper.title}</h3>
              <p className="text-gray-700">{paper.authors}</p>
              <p className="text-gray-500 text-sm">{paper.conference}</p>
              <a href={paper.link} className="text-blue-600 text-sm hover:underline mt-1 inline-block">Read Paper →</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
