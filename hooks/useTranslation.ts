import { useAppSettings } from '@/context/AppSettingsContext';
import { translations, type Language, type Translations } from '@/data/translations';

const SUPPORTED_LANGUAGE_CODES = new Set<string>([
  'English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati',
  'Kannada', 'Malayalam', 'Assamese', 'Odia', 'Punjabi', 'Urdu', 'Nepali', 'Kashmiri',
]);

export function useTranslation(): Translations {
  const { settings } = useAppSettings();
  const lang: Language = SUPPORTED_LANGUAGE_CODES.has(settings.language)
    ? (settings.language as Language)
    : 'English';
  return translations[lang];
}
