
import { useContext, useCallback } from 'react';
import { LocalizationContext } from '../context/LocalizationContext';
import { content } from '../constants/content';
import { Lang, Content, LocalizedString } from '../types';

const get = (obj: Content, path: string): LocalizedString | undefined => {
  const keys = path.split('.');
  // Fix: Use 'any' for the traversing variable to accommodate the broader range of types in the Content object (including arrays).
  let current: any = obj;
  for (let i = 0; i < keys.length; i++) {
    if (typeof current === 'object' && current !== null && keys[i] in current) {
      current = current[keys[i]];
    } else {
      return undefined;
    }
  }
  // The final cast was present in the original code. It assumes the path correctly leads to a LocalizedString.
  return current as LocalizedString;
};

export const useLocalization = () => {
  const { lang, setLang } = useContext(LocalizationContext);

  const t = useCallback((key: string): string => {
    const localizedString = get(content, key);
    return localizedString?.[lang] || key;
  }, [lang]);

  return { t, lang, setLang };
};
