export type Locale = (typeof locales)[number];

export const locales = ['en', 'ar-QA'] as const;
export const defaultLocale: Locale = 'en';
