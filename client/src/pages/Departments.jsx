import React, { useEffect, useState } from "react";
import {
  FaHeartbeat,
  FaBrain,
  FaBaby,
  FaEye,
  FaBone,
  FaAmbulance,
  FaStethoscope,
  FaShieldAlt,
  FaUsers,
  FaUserMd,
  FaClock,
} from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

// Map string icon names to actual React components
const iconMap = {
  FaHeartbeat: FaHeartbeat,
  FaBrain: FaBrain,
  FaBaby: FaBaby,
  FaEye: FaEye,
  FaBone: FaBone,
  FaAmbulance: FaAmbulance,
  FaStethoscope: FaStethoscope,
  FaShieldAlt: FaShieldAlt,
};

// These Tailwind classes are derived from your hex codes to provide the hover effect
const colorClassMap = {
  '#FF588B': { text: 'text-rose-500', hoverBg: 'hover:bg-rose-50' },
  '#8B5CF6': { text: 'text-violet-500', hoverBg: 'hover:bg-violet-50' },
  '#3B82F6': { text: 'text-blue-500', hoverBg: 'hover:bg-blue-50' },
  '#10B981': { text: 'text-emerald-500', hoverBg: 'hover:bg-emerald-50' },
  '#F97316': { text: 'text-orange-500', hoverBg: 'hover:bg-orange-50' },
  '#EF4444': { text: 'text-red-500', hoverBg: 'hover:bg-red-50' },
  '#6366F1': { text: 'text-indigo-500', hoverBg: 'hover:bg-indigo-50' },
  '#059669': { text: 'text-teal-500', hoverBg: 'hover:bg-teal-50' },
};

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/departments")
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load departments", err);
        setLoading(false);
      });
  }, []);

  const stats = [
    { label: "Medical Specialists", value: "10+" },
    { label: "Patients Served", value: "500+" },
    { label: "Years of Care", value: "1+" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-700">Loading departments...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 via-gray-50 to-white text-center py-20 px-6 sm:px-10">
        <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
          World-Class Medical Departments
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-2 mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent leading-tight">
          Excellence in Every Medical Specialty
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          True Heal Multispecialist Hospital in Badlapur offers advanced care
          across multiple specialties with compassion and innovation.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-12 mt-10">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gray-900">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Departments Grid */}
      <div className="container mx-auto py-16 px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {departments.map((dept) => {
            const IconComponent = iconMap[dept.icon];
            const colors = colorClassMap[dept.color];

            return (
              <div
                key={dept._id}
                className={`group relative bg-white border border-gray-200 rounded-3xl p-8 flex flex-col items-start shadow-sm transition-all duration-300 transform hover:scale-105 ${colors?.hoverBg}`}
              >
                {/* Removed Rating Badge as per your provided code */}

                <div className="flex items-center gap-6 w-full">
                  {/* Icon */}
                  {IconComponent && (
                    <div className="bg-gray-100 p-4 rounded-full shadow-inner">
                      <IconComponent className="w-8 h-8" style={{ color: dept.color }} />
                    </div>
                  )}

                  {/* Title & Description */}
                  <div className="flex-grow">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {dept.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{dept.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between w-full mt-6 text-gray-500">
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-xl text-gray-400" />
                    <div>
                      <p className="font-bold text-gray-900">{dept.patients}</p>
                      <p className="text-sm">Patients</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUserMd className="text-xl text-gray-400" />
                    <div>
                      <p className="font-bold text-gray-900">
                        {dept.specialists}
                      </p>
                      <p className="text-sm">Specialists</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-xl text-gray-400" />
                    <div>
                      <p className="font-bold text-gray-900">{dept.timing}</p>
                      <p className="text-sm">Timing</p>
                    </div>
                  </div>
                </div>

                {/* Book Appointment */}
                <button
                  onClick={() =>
                    (window.location.href = `/book-appointment?department=${dept.name}`)
                  }
                  className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition text-lg font-medium flex items-center justify-center gap-2 w-full"
                >
                  Book Appointment <FaArrowRight />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Departments;