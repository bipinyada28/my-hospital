import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.phone || !formData.email || !formData.message) {
    alert('Please fill in all required fields (*)');
    return;
  }

  setLoading(true); // ✅ Start loading

  try {
    const res = await fetch('http://localhost:5000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setLoading(false); // ✅ End loading

    if (res.ok) {
      alert('✅ Message sent successfully!');
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    } else {
      alert('❌ Failed to send message');
    }
  } catch (err) {
    setLoading(false);
    alert('❌ Error connecting to server!');
  }
};
  

  return (
    <div className="bg-blue-50 min-h-screen py-10 px-4 md:px-10">
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
            <div className="bg-blue-100 p-5 rounded-lg shadow" data-aos="fade-up">
              <h4 className="font-semibold text-blue-600 mb-2">📍 Location</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                True Heal Multispeciality Hospital<br />
                Vivek Complex, No.188<br />
                80 Feet Ring Road, Near BDA Complex<br />
                Nagarabhavi, Bengaluru, Karnataka 560072
              </p>
              <a
                href="https://www.google.com/maps?q=True+Heal+Multispeciality+Hospital"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
              >
                🍚 Get Directions
              </a>
            </div>

            {/* Phone Numbers */}
            <div className="bg-blue-100 p-5 rounded-lg shadow" data-aos="fade-up">
              <h4 className="font-semibold text-blue-600 mb-2">📞 Phone Numbers</h4>
              <p className="text-sm text-red-600 font-semibold">Emergency</p>
              <a href="tel:+918951177771" className="text-sm block mb-2 hover:underline">+91-8951177771</a>
              <p className="text-sm font-medium">Appointments</p>
              <a href="tel:+918951177772" className="text-sm block mb-2 hover:underline">+91-8951177772</a>
              <p className="text-sm font-medium">General Inquiry</p>
              <a href="tel:+918951177773" className="text-sm block hover:underline">+91-8951177773</a>
            </div>

            {/* Email */}
            <div className="bg-blue-100 p-5 rounded-lg shadow" data-aos="fade-up">
              <h4 className="font-semibold text-blue-600 mb-2">📧 Email</h4>
              <a href="mailto:info@trueheal.com" className="text-sm block hover:underline">info@trueheal.com</a>
              <a href="mailto:appointments@trueheal.com" className="text-sm hover:underline">appointments@trueheal.com</a>
            </div>

            {/* Hours */}
            <div className="bg-blue-100 p-5 rounded-lg shadow" data-aos="fade-up">
              <h4 className="font-semibold text-blue-600 mb-2">⏰ Hospital Hours</h4>
              <p className="text-sm">Emergency: <span className="text-red-600 font-semibold">24/7</span></p>
              <p className="text-sm">OPD: 8:00 AM - 8:00 PM</p>
              <p className="text-sm">Visiting: 4:00 PM - 7:00 PM</p>
            </div>
          </div>

          {/* Right Side - Form + Map */}
          <div className="space-y-6">
            {/* Contact Form */}
            <div className="bg-blue-100 p-5 rounded-lg shadow" data-aos="fade-left">
              <h4 className="text-blue-600 font-semibold text-lg mb-4">Send us a Message</h4>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    required
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number *"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="border p-2 rounded w-full"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address *"
                  required
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="border p-2 rounded w-full"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message *"
                  rows="1"
                  required
                  className="border p-2 rounded w-full"
                ></textarea>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded text-white ${
                      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-800'
                    }`}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
              </form>
            </div>

            {/* Map */} 
            <div className="bg-blue-100 p-6 rounded-lg shadow" data-aos="zoom-in">
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
                ></iframe>
              </div>
              <div className="grid grid-cols-3 text-center text-xs gap-2">
                <div className="bg-gray-100 py-2 rounded">🅿 Parking<br />Free available</div>
                <div className="bg-green-100 py-2 rounded">🚌 Public Transport<br />Bus stop nearby</div>
                <div className="bg-blue-200 py-2 rounded">♿ Accessibility<br />Wheelchair access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
