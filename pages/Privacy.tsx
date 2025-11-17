
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const Privacy: React.FC = () => {
  const { t } = useLocalization();

  const policyList = Array.from({ length: 9 }, (_, i) => ({
    title: t(`privacy.p${i + 1}title`),
    text: t(`privacy.p${i + 1}text`),
  }));

  return (
    <div className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-dark text-center mb-10">{t('privacy.title')}</h1>
        <div className="space-y-8">
          {policyList.map((policy, index) => (
            <div key={index} className="prose prose-lg max-w-none text-gray-700">
              <h2 className="text-2xl font-bold text-primary">{`${index + 1}. ${policy.title}`}</h2>
              <p>{policy.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
