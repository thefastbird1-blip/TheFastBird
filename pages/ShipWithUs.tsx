
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Link } from 'react-router-dom';

const ShipWithUs: React.FC = () => {
  const { t } = useLocalization();

  const steps = [
      { num: 1, title: 'shipWithUs.step1Title', text: 'shipWithUs.step1Text' },
      { num: 2, title: 'shipWithUs.step2Title', text: 'shipWithUs.step2Text' },
      { num: 3, title: 'shipWithUs.step3Title', text: 'shipWithUs.step3Text' },
      { num: 4, title: 'shipWithUs.step4Title', text: 'shipWithUs.step4Text' },
  ];
  
  const reasons = [
      'shipWithUs.reason1', 'shipWithUs.reason2', 'shipWithUs.reason3', 'shipWithUs.reason4', 'shipWithUs.reason5'
  ];

  return (
    <div className="py-12 md:py-20">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-dark">{t('shipWithUs.pageTitle')}</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{t('shipWithUs.pageSubtitle')}</p>
                <p className="mt-2 text-gray-600 max-w-3xl mx-auto">{t('shipWithUs.pageSubtitle2')}</p>
            </div>

            <div className="mb-16">
                <h2 className="text-3xl font-bold text-center text-primary mb-8">{t('shipWithUs.howItWorks')}</h2>
                <div className="relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-300"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step) => (
                            <div key={step.num} className="text-center relative z-10 bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-primary">
                                <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-primary text-white text-3xl font-bold shadow-lg">{step.num}</div>
                                <h3 className="text-xl font-bold text-dark mb-2">{t(step.title)}</h3>
                                <p className="text-gray-600">{t(step.text)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center text-primary mb-8">{t('shipWithUs.whyChooseUsTitle')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {reasons.map((reason, index) => (
                        <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                            <svg className="w-6 h-6 text-green-500 shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            <p className="text-gray-700">{t(reason)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-16 text-center">
                <h3 className="text-2xl font-bold text-dark">{t('shipWithUs.ctaTitle')}</h3>
                <p className="mt-2 text-gray-600 mb-6">{t('shipWithUs.ctaText')}</p>
                <Link to="/order-now" className="px-10 py-4 bg-accent text-white font-bold text-lg rounded-lg hover:bg-orange-600 transition-colors shadow-lg">
                    {t('shipWithUs.ctaButton')}
                </Link>
            </div>
        </div>
    </div>
  );
};

export default ShipWithUs;
