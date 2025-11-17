
import React from 'react';
import { Link } from 'react-router-dom';
import HeaderSlider from '../components/HeaderSlider';
import { useLocalization } from '../hooks/useLocalization';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { content } from '../constants/content';
import { LocalizedString } from '../types';

const Home: React.FC = () => {
  const { t, lang } = useLocalization();

  // This type assertion helps us access the nested array without making the global Content type overly complex.
  const deliveryCities = (content.home as any).deliveryAreas.cities as LocalizedString[];

  return (
    <div>
      <HeaderSlider />

      {/* About Us Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-center">
            <div className="md:col-span-1">
              <img src="https://g.top4top.io/p_36006y84g1.png" alt={t('about.title')} className="rounded-lg shadow-xl w-full h-auto object-cover" />
            </div>
            <div className="md:col-span-3 text-center md:text-start rtl:md:text-right">
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">{t('about.title')}</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                {t('about.p1')}
              </p>
              <Link to="/about" className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                {t('home.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ship With Us Preview */}
      <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-dark">{t('shipWithUs.title')}</h2>
                  <p className="mt-4 text-lg text-gray-600">{t('shipWithUs.subtitle')}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                  <div className="p-6">
                      <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-primary text-white text-2xl font-bold">1</div>
                      <h3 className="text-xl font-bold mb-2">{t('shipWithUs.step1Title')}</h3>
                      <img src="https://g.top4top.io/p_3600cwk4k1.png" alt={t('shipWithUs.step1Title')} className="mx-auto my-4 w-24 h-auto" />
                      <p className="text-gray-600">{t('shipWithUs.step1Text')}</p>
                  </div>
                  <div className="p-6">
                      <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-primary text-white text-2xl font-bold">2</div>
                      <h3 className="text-xl font-bold mb-2">{t('shipWithUs.step2Title')}</h3>
                      <img src="https://d.top4top.io/p_3600atpjg1.png" alt={t('shipWithUs.step2Title')} className="mx-auto my-4 w-24 h-auto" />
                      <p className="text-gray-600">{t('shipWithUs.step2Text')}</p>
                  </div>
                  <div className="p-6">
                      <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-primary text-white text-2xl font-bold">3</div>
                      <h3 className="text-xl font-bold mb-2">{t('shipWithUs.step3Title')}</h3>
                      <img src="https://f.top4top.io/p_3600b6l5g1.png" alt={t('shipWithUs.step3Title')} className="mx-auto my-4 w-24 h-auto" />
                      <p className="text-gray-600">{t('shipWithUs.step3Text')}</p>
                  </div>
                  <div className="p-6">
                      <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-primary text-white text-2xl font-bold">4</div>
                      <h3 className="text-xl font-bold mb-2">{t('shipWithUs.step4Title')}</h3>
                      <img src="https://h.top4top.io/p_3600mqc9z1.png" alt={t('shipWithUs.step4Title')} className="mx-auto my-4 w-24 h-auto" />
                      <p className="text-gray-600">{t('shipWithUs.step4Text')}</p>
                  </div>
              </div>
               <div className="text-center mt-12">
                   <Link to="/order-now" className="px-10 py-4 bg-accent text-white font-bold text-lg rounded-lg hover:bg-orange-600 transition-colors shadow-lg">
                       {t('shipWithUs.ctaButton')}
                   </Link>
               </div>
          </div>
      </section>

      {/* Delivery Areas Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-12">{t('home.deliveryAreas.title')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {deliveryCities.map((city, index) => (
              <div key={index} className="flex items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-transform transform hover:scale-105">
                <FaMapMarkerAlt className="h-5 w-5 text-primary mr-3 rtl:mr-0 rtl:ml-3 shrink-0" />
                <span className="font-semibold text-gray-800">{city[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

// Dummy react-icons components to satisfy TS
const FaIcon: React.FC<{className: string}> = ({className}) => <svg className={className}></svg>;
const dFaMapMarkerAlt = () => <FaIcon className="map-marker-alt"/>;
