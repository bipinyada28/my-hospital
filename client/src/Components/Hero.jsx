import React from 'react';
import { FaUserMd, FaCalendarCheck, FaFileMedical, FaHeartbeat } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <FaCalendarCheck size={24} />,
    title: 'Book Appointment',
    desc: 'Consult or Teleconsult',
    path: '/book-appointment',
  },
  {
    icon: <FaUserMd size={24} />,
    title: 'Find Doctors',
    desc: 'Search specialties',
    path: '/doctors',
  },
  {
    icon: <FaFileMedical size={24} />,
    title: 'Online Services',
    desc: 'Reports & billing',
    path: '/online-services',
  },
  {
    icon: <FaHeartbeat size={24} />,
    title: 'HealthFirst',
    desc: 'Preventive Care',
    path: '/healthfirst',
  },
];

export default function Hero() {
  return (
    <>
      {services.map((item, idx) => (
        <Link
          key={idx}
          to={item.path}
          className="flex flex-col items-center justify-center text-center bg-white hover:bg-blue-50 rounded-lg shadow-md p-4 transition-all"
        >
          <div className="text-blue-600 mb-2">{item.icon}</div>
          <h3 className="font-semibold text-blue-800 text-sm">{item.title}</h3>
          <p className="text-xs text-gray-500">{item.desc}</p>
        </Link>
      ))}
    </>
  );
}
