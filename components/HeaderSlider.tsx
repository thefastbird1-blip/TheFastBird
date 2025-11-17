
import React, { useState, useEffect, useCallback } from 'react';
import { useLocalization } from '../hooks/useLocalization';

const slides = [
  'https://k.top4top.io/p_3580bnz0u1.png',
  'https://c.top4top.io/p_3580f48zr1.png',
  'https://f.top4top.io/p_3580175581.png',
  'https://b.top4top.io/p_3580zoo3v1.png',
  'https://e.top4top.io/p_3580bfowk1.png',
];

const HeaderSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const { lang } = useLocalization();

  const nextSlide = useCallback(() => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  }, [current]);
  
  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);


  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={slide} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">The Fast Bird</h1>
        <p className="mt-4 text-lg md:text-2xl drop-shadow-md">DELIVERING AT THE SPEED OF FLIGHT</p>
      </div>

      <button onClick={prevSlide} className="absolute z-20 top-1/2 left-4 rtl:left-auto rtl:right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={lang === 'ar' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
        </svg>
      </button>
      <button onClick={nextSlide} className="absolute z-20 top-1/2 right-4 rtl:right-auto rtl:left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={lang === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
        </svg>
      </button>
      
      <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
            <button key={index} onClick={() => setCurrent(index)} className={`w-3 h-3 rounded-full ${index === current ? 'bg-primary' : 'bg-gray-300'}`}></button>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
