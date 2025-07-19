import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle } from 'lucide-react';

export const ContactUsDashboard: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus({ submitted: true, success: true, message: 'Your message has been sent successfully. Our team will get back to you soon!' });
    // Reset form after submission
    setFormData({ name: '', email: '', subject: '', message: '' });
    // In a real application, you'd send this data to a server
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: [
        "UWB Research Lab",
        "Department of Electrical Engineering",
        "Tech University",
        "123 Innovation Drive",
        "Silicon Valley, CA 94043"
      ]
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [
        "General Inquiries: info@uwblocalization.tech",
        "Technical Support: support@uwblocalization.tech",
        "Research Collaboration: research@uwblocalization.tech"
      ]
    },
    {
      icon: Phone,
      title: "Call Us",
      details: [
        "Main Office: +1 (555) 123-4567",
        "Lab Direct Line: +1 (555) 987-6543",
        "Hours: 9AM - 5PM (PST), Monday - Friday"
      ]
    }
  ];

  const topics = [
    "General Inquiry",
    "Technical Support",
    "Research Collaboration",
    "Product Information",
    "Career Opportunities",
    "Other"
  ];

  return (
    <div className="space-y-10 py-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Have questions about our UWB Localization System? We're here to help!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          {contactInfo.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
              </div>
              <div className="space-y-2 pl-2 border-l-2 border-blue-200">
                {item.details.map((detail, i) => (
                  <p key={i} className="text-gray-700">{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Send className="h-6 w-6 text-blue-600 mr-3" />
            Send Us a Message
          </h2>

          {formStatus && (
            <div className={`mb-6 p-4 rounded-lg ${formStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start space-x-3">
                {formStatus.success ? 
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> : 
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                }
                <p className={formStatus.success ? 'text-green-700' : 'text-red-700'}>
                  {formStatus.message}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select a topic</option>
                {topics.map((topic, index) => (
                  <option key={index} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Us</h2>
        <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
          {/* In a real application, you'd embed a Google Maps iframe or similar here */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-3" />
              <p className="text-gray-700">Interactive map would be displayed here</p>
              <p className="text-sm text-gray-500 mt-2">UWB Research Lab, 123 Innovation Drive, Silicon Valley, CA 94043</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
