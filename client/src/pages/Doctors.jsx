import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserMd,
  FaUsers,
  FaClock,
  FaSearch,
  FaFilter,
  FaStar,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Specialties");

  useEffect(() => {
    fetch("http://localhost:5000/api/public/doctors")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
        setLoading(false);
      });
  }, []);

  const departments = [
    "All Specialties",
    ...new Set(doctors.map((doc) => doc.department).filter(Boolean)),
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(search.toLowerCase()) ||
      doc.department?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      selectedDept === "All Specialties" || doc.department === selectedDept;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="text-center py-16 px-6 sm:px-10">
        <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
          Expert Medical Team
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4 text-gray-900 leading-tight">
          Meet Our Specialists
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Our team of experienced doctors combines medical excellence with
          compassionate care to provide you with the best healthcare experience.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6 mb-10 md:mb-16">
        <div className="relative w-full sm:w-1/2 md:w-1/3">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative w-full sm:w-auto">
          <FaFilter className="absolute top-3 left-3 text-gray-400" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-6 py-2 border border-gray-300 rounded-full bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            {departments.map((dept, i) => (
              <option key={i} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="container mx-auto px-6 pb-16">
        {filteredDoctors.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No doctors found for your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {filteredDoctors.map((doc) => (
              <div
                key={doc._id}
                className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200 transition-transform transform hover:scale-105"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Doctor Image */}
                  {doc.photoUrl ? (
                    <img
                      src={doc.photoUrl}
                      alt={doc.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                      No Photo
                    </div>
                  )}

                  {/* Doctor Info */}
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                      Dr. {doc.name}
                    </h3>
                    <p className="text-blue-600 font-medium text-sm">
                      {doc.department}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      {doc.bio || "No bio available"}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-600 mt-4">
                  <div className="flex items-center gap-2">
                    <FaUserMd className="text-blue-500" />
                    <span>{doc.experience ? `${doc.experience}+ yrs` : "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-green-500" />
                    <span>{doc.patients || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-orange-500" />
                    <span>{doc.timing || "By Appointment"}</span>
                  </div>
                </div>

                {/* Specializations */}
                {doc.specializations?.length > 0 && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                    {doc.specializations.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Book Button */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                  <Link
                    to={`/book-appointment?doctor=${doc._id}&department=${doc.department}`}
                    className="flex-grow text-center bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
