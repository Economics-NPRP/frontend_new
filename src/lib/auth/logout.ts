'use server';

import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import 'server-only';

import { extractSessionCookies } from '@/helpers';
import { getSession } from '@/lib/auth';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<{}> = (...errors) => ({
	ok: false,
	errors: errors,
});

type IFunctionSignature = () => Promise<ServerData<{}>>;
export const logout: IFunctionSignature = async () => {
	const t = await getTranslations();

	const cookieHeaders = await getSession();
	if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));
	const querySettings: RequestInit = {
		method: 'POST',
		headers: {
			Cookie: cookieHeaders,
		},
	};

	const queryUrl = new URL('/v1/auth/logout', process.env.NEXT_PUBLIC_BACKEND_URL);

	const response = await fetch(queryUrl, querySettings);

	if (response.status === 401 || response.status === 422)
		return getDefaultData(t('lib.auth.logout.loggedIn'));
	if (!response.ok) return getDefaultData(t('lib.auth.logout.error'));
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
};
