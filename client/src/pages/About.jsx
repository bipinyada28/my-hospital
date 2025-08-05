import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import hospitalImg from '../assets/hospital.jpg';
import doc1 from '../assets/doc1.jpeg';
import doc2 from '../assets/doc2.jpeg';
import doc3 from '../assets/doc3.jpeg';

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="bg-blue-50 py-10 px-4 md:px-10">
      {/* MAIN SECTION */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        <div data-aos="fade-right">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            About True Heal Hospital
          </h2>
          <p className="text-gray-700 mb-3">
            True Heal Multispeciality Hospital is a premier healthcare institution committed to world-class service and patient care.
          </p>
          <p className="text-gray-700 mb-5">
            We focus on personalized care, advanced technology, and holistic treatment methods.
          </p>

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-800 mb-6">
            <ul className="list-disc list-inside space-y-1">
              <li>State-of-the-art equipment</li>
              <li>Advanced diagnostics</li>
              <li>Digital records</li>
              <li>International standards</li>
            </ul>
            <ul className="list-disc list-inside space-y-1">
              <li>ICU units</li>
              <li>NABH accredited</li>
              <li>Telemedicine services</li>
              <li>Emergency Care</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">NABH Accredited</span>
            <span className="bg-green-100 text-green-900 px-3 py-1 rounded-full text-sm">ISO 9001:2015</span>
            <span className="bg-accentGreen text-white px-3 py-1 rounded-full text-sm">Green Hospital</span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6" data-aos="fade-left">
          <img
            src={hospitalImg}
            alt="Hospital"
            className="rounded-xl shadow-md w-full object-cover max-h-[260px]"
          />
          <div className="grid grid-cols-2 gap-4 w-full" data-aos="zoom-in-up">
            {[
              { label: 'Expert Doctors', value: '50+', icon: '🧑‍⚕️' },
              { label: 'Hospital Beds', value: '200+', icon: '🏥' },
              { label: 'Years of Service', value: '15+', icon: '📅' },
              { label: 'Emergency Care', value: '24/7', icon: '⏰' },
            ].map((item, i) => (
              <div key={i} className="bg-white text-center p-4 shadow rounded-xl">
                <div className="text-3xl mb-1">{item.icon}</div>
                <div className="text-primary text-xl font-bold">{item.value}</div>
                <div className="text-gray-600 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MISSION + VISION */}
      <div className="max-w-7xl mx-auto mt-16 grid md:grid-cols-2 gap-6">
        <div
          className="bg-white p-6 rounded-xl shadow border-l-4 border-primary"
          data-aos="fade-up"
        >
          <h3 className="text-lg font-semibold text-primary mb-2">Our Mission</h3>
          <p className="text-gray-700">
            To provide accessible, affordable, and quality healthcare services while maintaining the highest standards of medical excellence.
          </p>
        </div>
        <div
          className="bg-white p-6 rounded-xl shadow border-l-4 border-accentGreen"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h3 className="text-lg font-semibold text-accentGreen mb-2">Our Vision</h3>
          <p className="text-gray-700">
            To be the most trusted hospital, known for innovation, compassion, and long-term impact in health.
          </p>
        </div>
      </div>

      {/* MEET OUR DOCTORS */}
      <div className="max-w-7xl mx-auto mt-20" data-aos="fade-up">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-8">
          Meet Our Doctors
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[{ img: doc1, name: 'Dr. Meera Singh', spec: 'Cardiologist' },
            { img: doc2, name: 'Dr. Raj Patel', spec: 'Neurologist' },
            { img: doc3, name: 'Dr. Priya Verma', spec: 'Gynecologist' }].map((doc, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-4 text-center"
              data-aos="zoom-in"
              data-aos-delay={i * 150}
            >
              <img src={doc.img} alt={doc.name} className="w-24 h-24 mx-auto rounded-full object-cover mb-3" />
              <h4 className="font-semibold text-blue-700">{doc.name}</h4>
              <p className="text-sm text-gray-600">{doc.spec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TIMELINE / HISTORY */}
      <div className="max-w-4xl mx-auto mt-20" data-aos="fade-up">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-8">
          Our Journey
        </h2>
        <div className="space-y-6 border-l-4 border-primary pl-6">
          <div data-aos="fade-right">
            <p className="text-sm text-gray-500">2008</p>
            <h4 className="font-semibold text-primary">Founded in Badlapur</h4>
            <p className="text-gray-700 text-sm">Started as a small clinic with a big dream.</p>
          </div>
          <div data-aos="fade-right" data-aos-delay="150">
            <p className="text-sm text-gray-500">2013</p>
            <h4 className="font-semibold text-primary">Upgraded to Multispeciality</h4>
            <p className="text-gray-700 text-sm">Added ICU, diagnostics, and new departments.</p>
          </div>
          <div data-aos="fade-right" data-aos-delay="300">
            <p className="text-sm text-gray-500">2020</p>
            <h4 className="font-semibold text-primary">Digital Transformation</h4>
            <p className="text-gray-700 text-sm">Introduced telemedicine, EMR & online services.</p>
          </div>
        </div>
      </div>

      {/* EMBED VIDEO */}
      <div className="max-w-4xl mx-auto mt-20 text-center" data-aos="zoom-in-up">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Take a Virtual Tour</h2>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            className="w-full rounded-lg shadow-md"
            src="https://www.youtube.com/embed/VIDEO_ID_HERE"
            title="Hospital Tour"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    
    
     {/* ------------------ HOSPITAL LOCATION MAP ------------------ */}
      <div className="max-w-5xl mx-auto mt-20" data-aos="fade-up">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-6">
          Find Us on the Map
        </h2>
        <div className="rounded-xl overflow-hidden shadow-md">
          <iframe
            title="Hospital Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.6190687632343!2d73.23441897375942!3d19.16814484907614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be793ecf84bd7bb%3A0x6e0155e132049a69!2sTrue%20Heal%20Multispeciality%20Hospital!5e0!3m2!1smr!2sin!4v1753981836734!5m2!1smr!2sin"
            width="100%"
            height="100"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[400px] rounded-lg"
          ></iframe>
        </div>
      </div>
    </div> 
    
  );
};

export default About;
