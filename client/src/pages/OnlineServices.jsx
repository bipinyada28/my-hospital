import React from 'react';
import {
  CalendarCheck,
  Video,
  Pill,
  FileDown,
  CreditCard,
  MessageCircle,
} from 'lucide-react';

/**
 * OnlineServices.jsx
 *
 * This component presents a static, enhanced UI for the online services offered.
 * It's designed to be clean, modern, and aligned with the other pages.
 */
export default function OnlineServices() {
  const services = [
    {
      name: 'Book Appointments',
      description: 'Schedule consultations with your preferred doctor and manage your bookings with ease.',
      icon: <CalendarCheck size={32} className="text-sky-600" />,
    },
    {
      name: 'Online Consultations',
      description: 'Connect with doctors via secure video calls from the comfort and privacy of your home.',
      icon: <Video size={32} className="text-purple-600" />,
    },
    {
      name: 'Prescription Refills',
      description: 'Request new medication prescriptions or refills without the need for a physical visit.',
      icon: <Pill size={32} className="text-emerald-600" />,
    },
    {
      name: 'Medical Records',
      description: 'View, download, and securely store your lab reports and medical history in one place.',
      icon: <FileDown size={32} className="text-blue-600" />,
    },
    {
      name: 'Secure Payments',
      description: 'Easily pay for services and bills securely online through various payment modes.',
      icon: <CreditCard size={32} className="text-orange-600" />,
    },
    {
      name: 'Live Support',
      description: 'Get real-time assistance and answers to your questions through our live chat feature.',
      icon: <MessageCircle size={32} className="text-rose-600" />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-gray-50 to-white text-center py-20 px-6 sm:px-10">
        <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
          Digital Healthcare
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-2 mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent leading-tight">
          Seamless Care, Online Services
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Access our hospital's services from anywhere, anytime. Our digital platform is designed to put healthcare at your fingertips.
        </p>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto py-16 px-6 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <div className="bg-gray-100 p-4 rounded-full shadow-inner mb-4">
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {service.name}
              </h3>
              <p className="text-sm text-gray-500">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="py-16 px-6 sm:px-8 bg-sky-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to Start?</h2>
        <p className="mt-3 max-w-2xl mx-auto text-lg">
          Take control of your health journey. Book your first appointment online today and experience the convenience of digital healthcare.
        </p>
        <button
          onClick={() => (window.location.href = '/book-appointment')}
          className="mt-8 bg-white text-sky-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
        >
          Book an Appointment
        </button>
      </div>
    </div>
  );
}