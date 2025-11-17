import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLocalization } from '../hooks/useLocalization';
import { Lang } from '../types';

const Navbar: React.FC = () => {
  const { t, lang, setLang } = useLocalization();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'nav.home' },
    { path: '/about', label: 'nav.about' },
    { path: '/ship-with-us', label: 'nav.shipWithUs' },
    { path: '/track-order', label: 'nav.trackOrder' },
    { path: '/order-now#shipping-calculator', label: 'nav.shippingCalculator' },
    { path: '/order-now#order-form', label: 'nav.orderNow' },
  ];

  const toggleLanguage = () => {
    const newLang: Lang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <NavLink to="/" className="shrink-0">
              <img className="h-24 w-auto" src="https://d.top4top.io/p_36009zrn51.png" alt="The Fast Bird Logo" />
            </NavLink>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-8 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                className={({ isActive }) => {
                    const isOrderNowActive = link.path.startsWith('/order-now') && location.pathname === '/order-now';
                    const active = isActive || isOrderNowActive;
                    return `px-3 py-2 text-base font-bold rounded-md transition-colors duration-300 ${
                    active
                      ? 'text-primary'
                      : 'text-dark hover:text-primary'
                  }`
                }}
              >
                {t(link.label)}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
             <button onClick={toggleLanguage} className="px-4 py-2 text-sm font-medium text-dark bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            <div className="lg:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-dark focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => {
                    const isOrderNowActive = link.path.startsWith('/order-now') && location.pathname === '/order-now';
                    const active = isActive || isOrderNowActive;
                    return `block px-3 py-2 text-base font-bold rounded-md transition-colors duration-300 ${
                    active
                      ? 'text-primary bg-blue-50'
                      : 'text-dark hover:text-primary hover:bg-blue-50'
                  }`
                }}
              >
                {t(link.label)}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;