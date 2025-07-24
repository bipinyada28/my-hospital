// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { name: 'Patient Care', path: '/patient-care' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Services', path: '/departments' },
    { name: 'Academics', path: '/academics' },
    { name: 'Philanthropy', path: '/philanthropy' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="bg-blue-700 text-white px-4 py-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Mobile Toggle Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-sm font-semibold">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link to={link.path} className="hover:text-yellow-300">{link.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <ul className="md:hidden mt-2 flex flex-col gap-2 bg-blue-600 p-4 rounded">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link to={link.path} className="block hover:text-yellow-300" onClick={toggleMenu}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
