'use server';

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
	const cookieHeaders = await getSession();
	if (!cookieHeaders) return getDefaultData('You must be logged in to access this resource.');
	const querySettings: RequestInit = {
		method: 'POST',
		headers: {
			Cookie: cookieHeaders,
		},
	};

	const queryUrl = new URL('/v1/auth/logout', process.env.NEXT_PUBLIC_BACKEND_URL);

	const response = await fetch(queryUrl, querySettings);

	if (response.status === 401 || response.status === 422)
		return getDefaultData('You must be logged in to log out');
	if (!response.ok) return getDefaultData('There was an error logging out');
	if (!response.headers || response.headers.getSetCookie().length === 0)
		return getDefaultData('No cookies set in response');

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
