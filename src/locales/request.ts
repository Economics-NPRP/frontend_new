'use server';

import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

import { Locale, defaultLocale } from './config';

const COOKIE_NAME = 'NEXT_LOCALE';

export const getUserLocale = async (): Promise<Locale> => {
	return ((await cookies()).get(COOKIE_NAME)?.value as Locale) || defaultLocale;
};

export const setUserLocale = async (locale: Locale) => {
	(await cookies()).set(COOKIE_NAME, locale);
};

export const toggleUserLocale = async () => {
	const locale = await getUserLocale();
	(await cookies()).set(COOKIE_NAME, locale === 'en' ? 'ar' : 'en');
};

export default getRequestConfig(async () => {
	const locale = await getUserLocale();

	return {
		locale,
		messages: (await import(`./${locale}.json`)).default,
	};
});
