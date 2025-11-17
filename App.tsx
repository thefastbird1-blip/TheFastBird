
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from './context/LocalizationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import ShipWithUs from './pages/ShipWithUs';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import OrderNow from './pages/OrderNow';
import Contact from './pages/Contact';
import Chatbot from './components/Chatbot';
import TrackOrder from './pages/TrackOrder';
import CookieConsent from './components/CookieConsent';

const App: React.FC = () => {
  return (
    <LocalizationProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-gray-50 text-dark">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/ship-with-us" element={<ShipWithUs />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/order-now" element={<OrderNow />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
          <CookieConsent />
        </div>
      </HashRouter>
    </LocalizationProvider>
  );
};

export default App;