'use server';

import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import 'server-only';

import { extractSessionCookies } from '@/helpers';
import { ServerData } from '@/types';

export interface IRegisterOptions {
	registrationToken: string | null;
	password: string;
}

const getDefaultData: (...errors: Array<string>) => ServerData<{}> = (...errors) => ({
	ok: false,
	errors: errors,
});

type IFunctionSignature = (options: IRegisterOptions) => Promise<ServerData<{}>>;
export const register: IFunctionSignature = async ({ registrationToken, password }) => {
	const t = await getTranslations();

	if (!registrationToken) return getDefaultData(t('lib.auth.register.noToken'));

	const querySettings: RequestInit = {
		method: 'POST',
		body: JSON.stringify({ password }),
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const queryUrl = new URL(
		`/v1/auth/register/${registrationToken}`,
		process.env.NEXT_PUBLIC_BACKEND_URL,
	);
	const response = await fetch(queryUrl, querySettings);

	if (!response.ok) return getDefaultData(t('lib.auth.register.error'));
	if (!response.headers || response.headers.getSetCookie().length === 0)
		return getDefaultData(t('lib.noCookies'));

	const cookieStore = await cookies();
	extractSessionCookies(response, (key, value, exp) => {
		cookieStore.set(key, value, {
			httpOnly: true,
			secure: true,
			expires: exp,
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
