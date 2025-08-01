import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
// import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

import Hero from './Components/Hero';
import ImageSlider from './Components/ImageSlider';

import Home from './pages/Home';
import About from './pages/About';
import Departments from './pages/Departments';
import Doctors from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import Contact from './pages/Contact';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import OnlineServices from './pages/OnlineServices';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        {/* <Navbar /> */}

        <main className="flex-grow">
          <Routes>
            {/* Home Page with Slider + Hero */}
            <Route
              path="/"
              element={
<>
  {/* Full Banner */}
  <ImageSlider />

  {/* Desktop Hero Overlay */}
  <div className="hidden md:flex justify-center -mt-24 z-10 relative">
    <div className="grid grid-cols-4 gap-6 bg-white bg-opacity-90 p-4 rounded-xl shadow-lg max-w-5xl w-full mx-auto">
      <Hero />
    </div>
  </div>

  {/* Mobile 2x2 grid */}
  <div className="block md:hidden px-4 mt-4">
    <div className="grid grid-cols-2 gap-4">
      <Hero />
    </div>
  </div>

  <Home />
</>


              }
            />

            {/* Other Routes */}
            <Route path="/about" element={<About />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/online-services" element={<OnlineServices />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
