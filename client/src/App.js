import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Layout Components
import Header from './Components/Header';
import Footer from './Components/Footer';

// Page Components
import Home from './pages/Home';
import About from './pages/About';
import Departments from './pages/Departments';
import Doctors from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import Contact from './pages/Contact';
import OnlineServices from './pages/OnlineServices';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';
 //Dashords
import Dashboard from './pages/Dashboard/Dashboard';
import PatientDashboard from "./pages/Dashboard/PatientDashboard"; 
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
// Home Page Extras
import Hero from './Components/Hero';
import ImageSlider from './Components/ImageSlider';
import HealthFirst from './pages/HealthFirst';

// Authentication Modal
import AuthModal from './Components/AuthModal';

function AppContent() {
  const location = useLocation();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (location.state?.openAuth) {
      setAuthOpen(true);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <ImageSlider />

                {/* Desktop Hero */}
                <div className="hidden md:flex justify-center -mt-24 z-10 relative">
                  <div className="grid grid-cols-4 gap-6 bg-white bg-opacity-90 p-4 rounded-xl shadow-lg max-w-5xl w-full mx-auto">
                    <Hero />
                  </div>
                </div>

                {/* Mobile Hero */}
                <div className="block md:hidden px-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Hero />
                  </div>
                </div>

                <Home />
              </>
            }
          />

          {/* Other Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/online-services" element={<OnlineServices />} />
          <Route path="/healthfirst" element={<HealthFirst />} />

          {/* Reset Password */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Other routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/doctore-dashboard" element={<DoctorDashboard />} />


          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={() => setAuthOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
