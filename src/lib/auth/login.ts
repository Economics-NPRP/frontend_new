'use server';

import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import 'server-only';

import { extractSessionCookies } from '@/helpers';
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

	const querySettings: RequestInit = {
		method: 'POST',
		body: loginData,
	};

	const queryUrl = new URL(
		process.env.NODE_ENV === 'development' ? 'dev/auth/login' : '/v1/auth/oauth2',
		process.env.NEXT_PUBLIC_BACKEND_URL,
	);

	const response = await fetch(queryUrl, querySettings);

	if (response.status === 401) return getDefaultData(t('lib.auth.login.invalid'));
	if (!response.ok) return getDefaultData(t('lib.auth.login.error'));
	if (!response.headers || response.headers.getSetCookie().length === 0)
		return getDefaultData(t('lib.noCookies'));

	const cookieStore = await cookies();
	extractSessionCookies(response, (key, value, exp) => {
		cookieStore.set(key, value, {
			httpOnly: true,
			secure: true,
			expires: exp, // Convert milliseconds to seconds
			sameSite: 'lax',
			path: '/',
		});
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
