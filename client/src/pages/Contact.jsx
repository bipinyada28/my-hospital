import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-lightgrey min-h-screen py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-2">
          Contact Us
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Get in touch with us for appointments, inquiries, or emergency services. We're here to help 24/7.
        </p>

        {/* Main Grid */}
        <div className="grid md:grid-cols-[1fr_2fr] gap-8">

          {/* Left Side - Info Cards */}
          <div className="space-y-6">
            {/* Location */}
            <div className="bg-white p-5 rounded-lg shadow" data-aos="fade-up">
              <h4 className="font-semibold text-blue-600 mb-2">📍 Location</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                True Heal Multispeciality Hospital<br />
                Vivek Complex, No.188<br />
                80 Feet Ring Road<br />
                Near BDA Complex<br />
                Nagarabhavi, 2nd Stage<br />
                Bengaluru, Karnataka 560072
              </p>
              <button className="mt-3 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm flex items-center gap-2">
                <span>🍚 Get Directions</span>
              </button>
            </div>

            {/* Phone Numbers */}
            <div className="bg-white p-5 rounded-lg shadow" data-aos="fade-up">
              <h4 className="font-semibold text-blue-600 mb-2">📞 Phone Numbers</h4>
              <p className="text-sm text-red-600 font-semibold">Emergency</p>
              <p className="text-sm mb-2">+91-8951177771</p>
              <p className="text-sm font-medium">Appointments</p>
              <p className="text-sm mb-2">+91-8951177772</p>
              <p className="text-sm font-medium">General Inquiry</p>
              <p className="text-sm">+91-8951177773</p>
            </div>

            {/* Email */}
            <div className="bg-white p-5 rounded-lg shadow" data-aos="fade-up">
              <h4 className="font-semibold text-blue-600 mb-2">📧 Email</h4>
              <p className="text-sm">info@trueheal.com</p>
              <p className="text-sm">appointments@trueheal.com</p>
            </div>

            {/* Hours */}
            <div className="bg-white p-5 rounded-lg shadow" data-aos="fade-up">
              <h4 className="font-semibold text-blue-600 mb-2">⏰ Hospital Hours</h4>
              <p className="text-sm">Emergency: <span className="text-red-600 font-semibold">24/7</span></p>
              <p className="text-sm">OPD: 8:00 AM - 8:00 PM</p>
              <p className="text-sm">Visiting: 4:00 PM - 7:00 PM</p>
            </div>
          </div>

          {/* Right Side - Form + Map */}
          <div className="space-y-6">
            {/* Contact Form */}
            <div className="bg-white p-6 rounded-lg shadow" data-aos="fade-left">
              <h4 className="text-blue-600 font-semibold text-lg mb-4">Send us a Message</h4>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name *" className="border p-2 rounded w-full" />
                  <input type="tel" placeholder="Phone Number *" className="border p-2 rounded w-full" />
                </div>
                <input type="email" placeholder="Email Address *" className="border p-2 rounded w-full" />
                <input type="text" placeholder="Subject" className="border p-2 rounded w-full" />
                <textarea placeholder="Message *" rows="4" className="border p-2 rounded w-full"></textarea>
                <button type="submit" className="bg-primary text-white w-full py-2 rounded hover:bg-blue-800">
                  Send Message
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="bg-white p-6 rounded-lg shadow" data-aos="zoom-in">
              <h4 className="text-blue-600 font-semibold mb-3">Find Us</h4>
              <div className="w-full h-64 rounded overflow-hidden mb-4">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.6190687632343!2d73.23441897375942!3d19.16814484907614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be793ecf84bd7bb%3A0x6e0155e132049a69!2sTrue%20Heal%20Multispeciality%20Hospital!5e0!3m2!1smr!2sin!4v1753981836734!5m2!1smr!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="grid grid-cols-3 text-center text-xs gap-2">
                <div className="bg-gray-100 py-2 rounded">🅿 Parking<br />Free available</div>
                <div className="bg-green-100 py-2 rounded">🚌 Public Transport<br />Bus stop nearby</div>
                <div className="bg-blue-100 py-2 rounded">♿ Accessibility<br />Wheelchair access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
