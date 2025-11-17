
import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';

const CookieConsent: React.FC = () => {
    const { t } = useLocalization();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (consent === null) {
            setIsVisible(true);
        }
    }, []);

    const handleConsent = (accepted: boolean) => {
        localStorage.setItem('cookie_consent', accepted ? 'true' : 'false');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-dark text-white p-4 z-50 shadow-lg flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm flex-grow">{t('cookieConsent.message')}</p>
            <div className="flex items-center gap-4 flex-shrink-0">
                <button 
                    onClick={() => handleConsent(true)} 
                    className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    {t('cookieConsent.accept')}
                </button>
                <button 
                    onClick={() => handleConsent(false)} 
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    {t('cookieConsent.decline')}
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
