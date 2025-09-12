import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Heart,
  CalendarCheck,
  Stethoscope,
  ShieldCheck,
  Video,
  FileText,
  MessageCircle,
  Star,
  Hospital,
} from 'lucide-react';

import hospitalImg from '../assets/hospital.jpg';
import doc1 from '../assets/doc1.jpeg';
import doc2 from '../assets/doc2.jpeg';

/**
 * Home.jsx
 *
 * This component provides a comprehensive, static homepage UI, with
 * a dynamic "Meet Our Doctors" and "Our Departments" section that
 * fetches data from a backend.
 */
export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // Fetch a subset of doctors to display on the homepage
    fetch('http://localhost:5000/api/public/doctors?limit=3')
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoadingDoctors(false);
      })
      .catch((err) => {
        console.error('Error fetching doctors for homepage:', err);
        setLoadingDoctors(false);
      });

    // Fetch a subset of departments to display on the homepage
    fetch('http://localhost:5000/api/departments?limit=4')
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
        setLoadingDepartments(false);
      })
      .catch((err) => {
        console.error('Error fetching departments for homepage:', err);
        setLoadingDepartments(false);
      });
  }, []);

  const handleBookAppointment = () => {
    window.location.href = '/book-appointment';
  };

  const services = [
    { name: 'Online Consultations', icon: <Video size={32} className="text-sky-600" />, description: 'Connect with expert doctors from anywhere via secure video calls.' },
    { name: 'Medical Records', icon: <FileText size={32} className="text-purple-600" />, description: 'Access and manage your health reports and history securely online.' },
    { name: 'Book Appointments', icon: <CalendarCheck size={32} className="text-emerald-600" />, description: 'Easily schedule and manage your appointments with our specialists.' },
    { name: '24/7 Emergency Care', icon: <Stethoscope size={32} className="text-rose-600" />, description: 'Immediate, compassionate care for all your urgent medical needs.' },
  ];

  const handleViewAllDepartments = () => {
    window.location.href = '/departments';
  };

  const handleViewAllDoctors = () => {
    window.location.href = '/doctors';
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-gray-50 to-white text-center py-20 px-6 sm:px-10" data-aos="fade-up">
        <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
          Your Health, Our Priority
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-2 mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent leading-tight">
          Compassionate Care, Advanced Technology
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          True Heal Hospital is dedicated to providing world-class healthcare with a human touch. Your well-being is our mission.
        </p>
        <button
          onClick={handleBookAppointment}
          className="mt-8 bg-sky-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-sky-700 transition-colors shadow-lg"
        >
          Book an Appointment
        </button>
      </div>

      ---

      {/* Services Section */}
      <div className="container mx-auto py-16 px-6 sm:px-8" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Our Key Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 text-center shadow-md border border-gray-200 transition-all transform hover:scale-105"
              data-aos="zoom-in"
              data-aos-delay={index * 150}
            >
              <div className="bg-gray-100 p-4 rounded-full inline-block mb-4 shadow-inner">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-500">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      ---

      {/* Our Departments Section */}
      <div className="py-16 px-6 sm:px-10 bg-white" data-aos="fade-up">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Our Departments
          </h2>
          {loadingDepartments ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-600 text-lg">Loading departments...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {departments.map((dept, index) => (
                  <div
                    key={dept._id}
                    className="bg-gray-50 rounded-xl p-6 text-center shadow-sm border border-gray-200 transition-all transform hover:scale-105"
                    data-aos="zoom-in"
                    data-aos-delay={index * 150}
                  >
                    <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-inner">
                      <Hospital size={24} className="text-sky-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{dept.name}</h3>
                    <p className="text-sm text-gray-500">{dept.description}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <button
                  onClick={handleViewAllDepartments}
                  className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  View All Departments
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      ---

      {/* Meet Our Doctors Section */}
      <div className="container mx-auto py-16 px-6 sm:px-8" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Meet Our Expert Doctors
        </h2>
        {loadingDoctors ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-600 text-lg">Loading doctors...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {doctors.map((doc, index) => (
                <div
                  key={doc._id}
                  className="bg-white rounded-3xl p-6 text-center shadow-md border border-gray-200 transition-all transform hover:scale-105"
                  data-aos="zoom-in"
                  data-aos-delay={index * 150}
                >
                  {doc.photoUrl ? (
                    <img src={doc.photoUrl} alt={doc.name} className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-4 border-white shadow-md" />
                  ) : (
                    <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs mb-4">
                      No Photo
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900">Dr. {doc.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{doc.specialty}</p>
                  <button
                    onClick={() => (window.location.href = `/doctors?id=${doc._id}`)}
                    className="mt-4 text-sm text-blue-600 hover:underline"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <button
                onClick={handleViewAllDoctors}
                className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                View All Doctors
              </button>
            </div>
          </>
        )}
      </div>

      ---

      {/* Testimonial Section */}
      <div className="bg-white py-16 px-6 sm:px-8" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            What Our Patients Say
          </h2>
          <div className="relative p-8 bg-gray-100 rounded-xl shadow-md">
            <div className="absolute top-0 left-0 -mt-3 -ml-3 text-sky-600 flex space-x-1">
              <Star size={20} fill="currentColor" />
              <Star size={20} fill="currentColor" />
              <Star size={20} fill="currentColor" />
              <Star size={20} fill="currentColor" />
              <Star size={20} fill="currentColor" />
            </div>
            <p className="text-lg text-gray-700 italic mt-6">
              "The care I received at True Heal was exceptional. The doctors were knowledgeable and compassionate, and the staff made me feel comfortable from start to finish. Highly recommend!"
            </p>
            <p className="mt-4 font-semibold text-gray-800">- Jane Doe, Patient</p>
          </div>
        </div>
      </div>

      ---

      {/* Final Call to Action */}
      <div className="py-16 px-6 sm:px-8 bg-sky-600 text-white text-center" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to Start?</h2>
        <p className="mt-3 max-w-2xl mx-auto text-lg">
          Take control of your health journey. Schedule your first online consultation today and experience the convenience of digital healthcare.
        </p>
        <button
          onClick={handleBookAppointment}
          className="mt-8 bg-white text-sky-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          Book an Appointment
        </button>
      </div>
    </div>
  );
}