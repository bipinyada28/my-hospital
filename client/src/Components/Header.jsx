import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt, FaBars, FaTimes } from 'react-icons/fa';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo2.png';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  React.useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Departments', path: '/departments' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Online Services', path: '/online-services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-lg bg-red' : 'relative'} transition-shadow duration-300`}>
      {/* Top Bar */}
      <div className="hidden md:flex bg-blue-700 text-white text-sm flex-wrap items-center justify-between px-4 py-2">
        <div className="flex gap-4 flex-wrap">
          <span className="flex items-center gap-1"><FaPhone /> +1 (555) 123-4567</span>
          <span className="flex items-center gap-1"><FaEnvelope /> info@trueheal.com</span>
          <span className="flex items-center gap-1"><FaClock /> 24/7 Emergency</span>
        </div>
        <div className="flex items-center gap-1"><FaMapMarkerAlt /> 123 Healthcare Ave, Medical City</div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left - Logo */}
          <div className="flex-1">
            <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
              <img src={logo} alt="True Heal Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-lg font-bold text-blue-700">TRUE HEAL</h1>
                <p className="text-xs text-gray-500">Multispeciality Hospital</p>
              </div>
            </Link>
          </div>

          {/* Center - Nav Links */}
          <nav className="hidden md:flex flex-4 justify-center gap-6 text-sm font-medium text-gray-800">
            {navLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1 rounded-md transition transform duration-300 ease-in-out
                  ${
                    isActive
                      ? 'bg-blue-700 text-white font-bold underline underline-offset-4'
                      : 'hover:bg-blue-100 hover:text-blue-700 hover:scale-110'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right - Buttons */}
          <div className="flex-1 hidden md:flex justify-end gap-2">
            <Link
              to="/login"
              className="border border-blue-700 text-blue-700 px-3 py-1 text-sm rounded-md hover:bg-blue-700 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/book"
              className="bg-blue-700 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-800 transition"
            >
              Book Appointment
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-blue-700" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 bg-blue-700 text-white rounded-md shadow-lg p-4 space-y-3">
            {navLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-center transition
                  ${
                    isActive
                      ? 'bg-white text-blue-700 font-semibold'
                      : 'hover:bg-white hover:text-blue-700'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/login"
              className="block border border-white px-2.5 py-1 text-sm rounded text-center hover:bg-white hover:text-blue-700 transition"
            >
              Login
            </Link>
            <Link
              to="/book"
              className="block bg-white text-blue-700 px-2.5 py-1 text-sm rounded text-center hover:bg-yellow-300 transition"
            >
              Book Appointment
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
