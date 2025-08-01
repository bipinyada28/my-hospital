// src/pages/Doctors.jsx

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const doctors = [
  {
    id: 1,
    name: 'Dr. Raj Patel',
    specialization: 'Cardiologist',
    experience: '12 years',
    timing: 'Mon–Fri, 10AM–4PM',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Dr. Meera Singh',
    specialization: 'Dermatologist',
    experience: '9 years',
    timing: 'Tue–Sat, 9AM–3PM',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Dr. Priya Verma',
    specialization: 'Gynecologist',
    experience: '15 years',
    timing: 'Mon–Sat, 11AM–5PM',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 4,
    name: 'Dr. Rohit Deshmukh',
    specialization: 'Orthopedic',
    experience: '8 years',
    timing: 'Mon–Thu, 10AM–1PM',
    image: 'https://via.placeholder.com/150',
  },
];

const Doctors = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-lightgrey py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-3xl font-bold text-center text-primary mb-12"
          data-aos="fade-down"
        >
          Meet Our Specialists
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {doctors.map((doc, index) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-blue-100 mb-4"
              />
              <h3 className="text-xl text-blue-700 font-bold text-center">{doc.name}</h3>
              <p className="text-center text-sm text-gray-600 mb-2">
                {doc.specialization}
              </p>
              <div className="text-sm text-gray-500 text-center mb-2">
                🕐 {doc.timing}
              </div>
              <div className="text-sm text-gray-500 text-center mb-4">
                📅 {doc.experience}
              </div>
              <button
                className="bg-primary text-white px-4 py-2 rounded-full block mx-auto hover:bg-blue-800 transition"
                onClick={() => alert(`Book appointment with ${doc.name}`)}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
