import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/auth';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerifyOTP, setShowVerifyOTP] = useState(false); // ✅ New OTP modal

  const [forgotEmail, setForgotEmail] = useState('');
  const [loading, setLoading] = useState(false); // ✅ Loading for signup/login
  const [otpLoading, setOtpLoading] = useState(false); // ✅ Loading for OTP verification
  const [forgotLoading, setForgotLoading] = useState(false);


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

  // STEP 1: Handle Signup/Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double click

    setLoading(true);
    if (isSignup) {
      if (!formData.acceptTerms) {
        alert("Please accept the Terms and Conditions.");
        setLoading(false);
        return;
      }

      try {
        await axios.post(`${API_BASE}/register`, {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });

        alert("Registration successful. OTP sent to your email.");
        setShowVerifyOTP(true); // open OTP modal
      } catch (err) {
        alert(err.response?.data?.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await axios.post(`${API_BASE}/login`, {
          email: formData.email,
          password: formData.password,
        });

        const token = res.data.token;
        if (token) {
          localStorage.setItem("token", token);
          onLogin();
          onClose();
        }
      } catch (err) {
        const message = err.response?.data?.message || "Login failed";
        if (message.toLowerCase().includes("verify your email")) {
          alert("Please enter the OTP sent to your email to verify your account.");
          setShowVerifyOTP(true); // open OTP modal for login
        } else {
          alert(message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (otpLoading) return; // prevent double click
    if (!formData.otp) {
      alert("Please enter the OTP.");
      return;
    }

    setOtpLoading(true);
    try {
      await axios.post(`${API_BASE}/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });

      alert("Account verified. You can now log in.");
      setIsSignup(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        otp: '',
        acceptTerms: false,
      });
      setShowVerifyOTP(false);
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSendResetLink = async () => {
    if (forgotLoading) return; // prevent multiple clicks

    setForgotLoading(true);
    try {
      await axios.post(`${API_BASE}/forgot-password`, { email: forgotEmail });
      alert('Password reset link sent to your email.');
      setForgotEmail('');
      setShowForgotPassword(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending reset link');
    } finally {
      setForgotLoading(false);
    }
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
            disabled={loading}
            className={`w-full text-white p-2 rounded ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
            }`}
          >
            {loading ? 'Processing...' : isSignup ? 'Register' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
            }}
            className="text-blue-600 hover:underline"
          >
            {isSignup ? 'Sign In' : 'Register'}
          </button>
        </p>

        {/* Forgot Password Modal */}
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
                disabled={forgotLoading}
                className={`w-full text-white py-2 rounded transition ${
                  forgotLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                {forgotLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

            </div>
          </div>
        )}


        {/* OTP Verification Modal */}
        {showVerifyOTP && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                onClick={() => setShowVerifyOTP(false)}
                className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Verify Your Email</h2>
              <p className="text-sm text-gray-600 mb-3">
                Enter the OTP sent to <strong>{formData.email}</strong>
              </p>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleVerifyOTP}
                disabled={otpLoading}
                className={`w-full text-white py-2 rounded ${
                  otpLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                {otpLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
