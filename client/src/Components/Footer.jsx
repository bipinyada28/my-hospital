// src/components/Footer.jsx
import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        {/* Contact */}
        <div>
          <h4 className="font-bold mb-2">Contact Us</h4>
          <p className="flex items-center gap-2">
            <FaPhoneAlt /> +91 77699 33444
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope /> trueheal@gmail.com
          </p>
        </div>

        {/* Location */}
        <div>
          <h4 className="font-bold mb-2">Location</h4>
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt />
            Krupa Sindhu Building,<br />
            Station Rd, Near Mahalaxmi Mandir,<br />
            West, Badlapur, Maharashtra
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-bold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li><a href="/about" className="hover:text-cyan-300">About Us</a></li>
            <li><a href="/departments" className="hover:text-cyan-300">Departments</a></li>
            <li><a href="/book-appointment" className="hover:text-cyan-300">Appointments</a></li>
            <li><a href="/contact" className="hover:text-cyan-300">Contact</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-xs mt-6 border-t border-blue-700 pt-3">
        &copy; {new Date().getFullYear()} True Heal Multispeciality Hospital. All rights reserved.
      </div>
    </footer>
  );
}
