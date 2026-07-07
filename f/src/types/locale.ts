export const CONTENT_LOCALE = "uz" as const;
export type Locale = typeof CONTENT_LOCALE;

export const LOCALES = [
  {
    code: CONTENT_LOCALE,
    label: "O'zbek",
    flag: "🇺🇿",
    htmlLang: "uz",
  },
] as const;

export type LocaleConfig = (typeof LOCALES)[number];

export const DEFAULT_LOCALE = CONTENT_LOCALE;
export const HTML_LANG = "uz";
