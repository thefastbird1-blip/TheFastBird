
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const Terms: React.FC = () => {
  const { t } = useLocalization();

  const termsList = Array.from({ length: 10 }, (_, i) => ({
    title: t(`terms.t${i + 1}title`),
    text: t(`terms.t${i + 1}text`),
  }));

  return (
    <div className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-dark text-center mb-10">{t('terms.title')}</h1>
        <div className="space-y-8">
          {termsList.map((term, index) => (
            <div key={index} className="prose prose-lg max-w-none text-gray-700">
              <h2 className="text-2xl font-bold text-primary">{`${index + 1}. ${term.title}`}</h2>
              <p>{term.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terms;
