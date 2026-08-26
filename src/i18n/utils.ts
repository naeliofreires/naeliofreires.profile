import en from './en.json';
import pt from './pt.json';

const translations = { en, pt } as const;

export type SupportedLocale = keyof typeof translations;

export function getLangFromUrl(url: URL): SupportedLocale {
  const [, lang] = url.pathname.split('/');
  if (lang === 'pt') return 'pt';
  return 'en';
}

export function getPathWithoutLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'en' || parts[0] === 'pt') {
    return '/' + parts.slice(1).join('/');
  }
  return pathname;
}

export function getLocalizedPath(path: string, lang: SupportedLocale): string {
  return `/${lang}${path}`;
}

const defaultLocale: SupportedLocale = 'en';
const locales: SupportedLocale[] = ['en', 'pt'];

export { defaultLocale, locales };

export function t(lang: SupportedLocale, key: string): string {
  const data = translations[lang] ?? translations[defaultLocale];
  const keys = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = data;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  if (typeof value === 'string') return value;
  return key;
}
