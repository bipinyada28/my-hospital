import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

// Authentication Components
import Auth from './pages/Auth';

// Home Page Extras
import Hero from './Components/Hero';
import ImageSlider from './Components/ImageSlider';

function App() {
  return (
    <Router>
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
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/online-services" element={<OnlineServices />} />
            <Route path="/login" element={<Auth />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
