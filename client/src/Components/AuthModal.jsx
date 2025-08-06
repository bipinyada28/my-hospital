import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    otp: '',
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup && !formData.acceptTerms) {
      alert('Please accept the Terms and Conditions.');
      return;
    }
    onLogin();
    onClose();
  };

  const handleSendResetLink = () => {
    console.log('Reset link sent to:', forgotEmail);
    alert(`Reset link sent to ${forgotEmail}`);
    setForgotEmail('');
    setShowForgotPassword(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative animate-fade-in p-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-lg"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">
          {isSignup ? 'Create an Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          {isSignup && (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          )}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          {!isSignup && (
            <div className="text-right text-sm">
              <p
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </p>
            </div>
          )}

          {isSignup && (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline whitespace-nowrap"
              >
                Send OTP
              </button>
            </div>
          )}

          {isSignup && (
            <label className="text-sm flex items-start gap-2">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
              />
              I accept the{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms & Conditions
              </Link>
            </label>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-800"
          >
            {isSignup ? 'Register' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:underline"
          >
            {isSignup ? 'Sign In' : 'Register'}
          </button>
        </p>

        {/* Forgot Password Modal Inline */}
        {showForgotPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Forgot Password</h2>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendResetLink}
                className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
