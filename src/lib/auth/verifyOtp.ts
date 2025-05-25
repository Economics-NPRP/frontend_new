'use server';

import { camelCase } from 'change-case/keys';
import { cookies } from 'next/headers';
import 'server-only';

import { extractCookies } from '@/helpers';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<{}> = (...errors) => ({
	ok: false,
	errors: errors,
});

type IFunctionSignature = (otp: string) => Promise<ServerData<{}>>;
export const verifyOtp: IFunctionSignature = async (otp) => {
	const cookieStore = await cookies();
	const otpToken = cookieStore.get('ets_otp_token');
	const querySettings: RequestInit = {
		method: 'POST',
		body: JSON.stringify(otp),
		headers: {
			'Content-Type': 'application/json',
			Cookie: otpToken ? `ets_otp_token=${otpToken.value}` : '',
		},
	};

	const queryUrl = new URL('/v1/auth/otp', process.env.NEXT_PUBLIC_BACKEND_URL);

	const response = await fetch(queryUrl, querySettings);
	const rawData = camelCase(await response.json(), 5) as ServerData<{}>;

	//	If theres an issue, return the default data with errors
	if (!rawData) return getDefaultData('No data was returned.');
	if (rawData.detail) return getDefaultData(JSON.stringify(rawData.detail ?? ''));
	if (rawData.errors) return getDefaultData(...rawData.errors);
	if (!response.headers || response.headers.getSetCookie().length === 0)
		return getDefaultData('No cookies set in response');

	//	Extract access and refresh tokens from the response cookies and delete otp cookie
	extractCookies(response, (key, value, exp) => {
		cookieStore.set(key, value, {
			httpOnly: true,
			secure: true,
			expires: exp, // Convert milliseconds to seconds
			sameSite: 'lax',
			path: '/',
		});
	});

	return {
		ok: true,
	};
};
