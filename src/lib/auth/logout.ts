'use server';

import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import 'server-only';

import { extractSessionCookies, getCookieOptions, internalUrl } from '@/helpers';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<{}> = (...errors) => ({
	ok: false,
	errors: errors,
});

type IFunctionSignature = () => Promise<ServerData<{}>>;
export const logout: IFunctionSignature = async () => {
	const t = await getTranslations();

	const cookieStore = await cookies();
	const access = cookieStore.get('ets_access_token')?.value;
	const refresh = cookieStore.get('ets_refresh_token')?.value;
	const cookieHeaders =
		access && refresh ? `ets_access_token=${access}; ets_refresh_token=${refresh}` : '';
	if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));
	const querySettings: RequestInit = {
		method: 'POST',
		headers: {
			Cookie: cookieHeaders,
			...(await (async () => {
				try {
					const h = await headers();
					const xff = h.get('x-forwarded-for') || h.get('x-real-ip');
					return xff ? { 'X-Forwarded-For': xff } : {};
				} catch {
					return {} as Record<string, string>;
				}
			})()),
		},
	};

	const response = await fetch(await internalUrl('/api/proxy/v1/auth/logout'), querySettings);

	if (response.status === 401 || response.status === 422)
		return getDefaultData(t('lib.auth.logout.loggedIn'));
	if (!response.ok) return getDefaultData(t('lib.auth.logout.error'));
	if (!response.headers || response.headers.getSetCookie().length === 0)
		return getDefaultData(t('lib.noCookies'));

	extractSessionCookies(response, (key, value, exp) => {
		cookieStore.set(key, value, getCookieOptions(exp));
	});

	//	TODO: change this once the backend doesnt return null
	return {
		ok: true,
	};
};
