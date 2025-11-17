import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const About: React.FC = () => {
  const { t, lang } = useLocalization();

  const sections: { title: string; text: string; image?: string; }[] = [
    { title: 'about.visionTitle', text: 'about.visionText', image: 'https://d.top4top.io/p_3601sg3w31.png' },
    { title: 'about.servicesTitle', text: 'about.servicesText', image: 'https://e.top4top.io/p_3601bwvkr1.png' },
    { title: 'about.valuesTitle', text: 'about.valuesText', image: 'https://d.top4top.io/p_3601ockq81.png' },
    { title: 'about.whyUsTitle', text: 'about.whyUsText', image: 'https://g.top4top.io/p_36010k0521.png' },
    { title: 'about.missionTitle', text: 'about.missionText' },
  ];

  return (
    <div className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark">{t('about.title')}</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{t('about.p1')}</p>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">{t('about.p2')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {sections.map((section, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-4">{t(section.title)}</h2>
              {section.image && (
                <img 
                  src={section.image} 
                  alt={t(section.title)} 
                  className="ml-auto my-4 w-24 h-auto" 
                />
              )}
              <ul className="space-y-2 text-gray-700 list-disc list-inside rtl:list-outside rtl:pr-4">
                  {t(section.text).split('\n').map((item, i) => item.trim() && <li key={i}>{item.trim()}</li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center bg-primary text-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold">{t('about.ctaTitle')}</h3>
          <p className="mt-2">{t('about.ctaText')}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
