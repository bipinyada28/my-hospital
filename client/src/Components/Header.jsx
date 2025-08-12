import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt, FaBars, FaTimes } from 'react-icons/fa';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import logo from '../assets/logo2.png';
import AuthModal from './AuthModal';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

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

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('auth');
    navigate('/');
  };

  return (
    <>
      {/* ✅ Auth Modal */}
      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogin={() => setIsLoggedIn(true)}
      />

      <header className="relative">
        {/* ✅ Top Info Bar (always visible) */}
        <div className="hidden md:flex bg-blue-700 text-white text-sm flex-wrap items-center justify-between px-4 py-2">
          <div className="flex gap-4 flex-wrap">
            <span className="flex items-center gap-1"><FaPhone /> +1 (555) 123-4567</span>
            <span className="flex items-center gap-1"><FaEnvelope /> info@trueheal.com</span>
            <span className="flex items-center gap-1"><FaClock /> 24/7 Emergency</span>
          </div>
          <div className="flex items-center gap-1"><FaMapMarkerAlt /> 123 Healthcare Ave, Medical City</div>
        </div>

        {/* ✅ Sticky NavBar */}
        <div className={`${isSticky ? 'fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur shadow-md text-gray-800' : 'relative bg-white text-gray-800'} transition-all duration-300`}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

            {/* Logo */}
            <div className="flex-1">
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="True Heal Logo" className="h-10 w-10" />
                <div>
                  <h1 className={`text-lg font-bold ${isSticky ? 'text-blue-700' : 'text-blue-700'}`}>
                    TRUE HEAL
                  </h1>
                  <p className={`text-xs ${isSticky ? 'text-gray-500' : 'text-gray-500'}`}>
                    Multispeciality Hospital
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className={`hidden md:flex gap-6 text-sm font-medium ${isSticky ? 'text-gray-800' : 'text-gray-800'}`}>
              {navLinks.map(link => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-1 rounded-md transition transform duration-300 ease-in-out ${
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

            {/* Auth Buttons */}
            <div className="flex-1 hidden md:flex justify-end gap-2">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="border border-red-600 text-red-600 px-3 py-1 text-sm rounded-md hover:bg-red-600 hover:text-white transition"
                  >
                    Logout
                  </button>
                  <Link
                    to="/dashboard"
                    className="border border-blue-700 text-blue-700 px-3 py-1 text-sm rounded-md hover:bg-blue-700 hover:text-white transition"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="border border-blue-700 text-blue-700 px-3 py-1 text-sm rounded-md hover:bg-blue-700 hover:text-white transition"
                >
                  Login
                </button>
              )}
              <Link
                to="/book"
                className="bg-blue-700 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-800 transition"
              >
                Book Appointment
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className={`md:hidden ${isSticky ? 'text-blue-700' : 'text-gray-800'}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
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
                    `block px-3 py-2 rounded-md text-center transition ${
                      isActive ? 'bg-white text-blue-700 font-semibold' : 'hover:bg-white hover:text-blue-700'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              {isLoggedIn ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="block border border-white px-2.5 py-1 text-sm rounded text-center hover:bg-white hover:text-red-600 transition w-full"
                  >
                    Logout
                  </button>
                  <Link
                    to="/dashboard"
                    className="block border border-white px-2.5 py-1 text-sm rounded text-center hover:bg-white hover:text-blue-700 transition w-full"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="block border border-white px-2.5 py-1 text-sm rounded text-center hover:bg-white hover:text-blue-700 transition w-full"
                >
                  Login
                </button>
              )}
              <Link
                to="/book"
                className="block bg-white text-blue-700 px-2.5 py-1 text-sm rounded text-center hover:bg-yellow-300 transition"
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>

        {/* ✅ Spacer to Prevent Jump */}
        {isSticky && <div style={{ height: '70px' }}></div>}
      </header>
    </>
  );
}
