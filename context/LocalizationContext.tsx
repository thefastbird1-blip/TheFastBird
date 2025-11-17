import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Lang } from '../types';

interface LocalizationContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const LocalizationContext = createContext<LocalizationContextType>({
  lang: 'ar',
  setLang: () => {},
});

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('ar');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.className = lang === 'ar' ? 'font-cairo' : 'font-sans';
  }, [lang]);

  return (
    <LocalizationContext.Provider value={{ lang, setLang }}>
      {children}
    </LocalizationContext.Provider>
  );
};