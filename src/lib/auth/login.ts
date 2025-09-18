'use server';

import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import 'server-only';

import { extractSessionCookies, getCookieOptions, internalUrl } from '@/helpers';
import { ILoginData } from '@/schema/models';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<{}> = (...errors) => ({
	ok: false,
	errors: errors,
});

type IFunctionSignature = (options: ILoginData) => Promise<ServerData<{}>>;
export const login: IFunctionSignature = async ({ email, password }) => {
	const t = await getTranslations();

	const loginData = new FormData();
	loginData.append('username', email);
	loginData.append('password', password);

	const h = await headers();
	const xff = h.get('x-forwarded-for') || h.get('x-real-ip');
	const querySettings: RequestInit = {
		method: 'POST',
		body: loginData,
		headers: {
			...(xff ? { 'X-Forwarded-For': xff } : {}),
		},
	};

	const path =
		process.env.NODE_ENV === 'development'
			? '/api/proxy/dev/auth/login'
			: '/api/proxy/v1/auth/oauth2';

	const response = await fetch(await internalUrl(path), querySettings);

	if (response.status === 401) return getDefaultData(t('lib.auth.login.invalid'));
	if (!response.ok) return getDefaultData(t('lib.auth.login.error'));
	if (!response.headers || response.headers.getSetCookie().length === 0)
		return getDefaultData(t('lib.noCookies'));

	const cookieStore = await cookies();
	extractSessionCookies(response, (key, value, exp) => {
		cookieStore.set(key, value, getCookieOptions(exp));
	});

	//	TODO: change this once the backend doesnt return null
	return {
		ok: true,
	};

	// //	If theres an issue, return the default data with errors
	// if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	// if (rawData.errors) return getDefaultData(...rawData.errors);

	// return {
	// 	ok: true,
	// };
};
