/**
 * Hook useTranslation : fournit les traductions selon la langue de l'utilisateur
 */

import { usePreferences } from '../context/PreferencesContext';
import { translations, TranslationKey } from '../constants/i18n';

export const useTranslation = () => {
  const { preferences } = usePreferences();
  const lang = preferences.language;

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations.fr[key] || key;
  };

  return { t, lang };
};
