'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import 'server-only';

import { extractSessionCookies } from '@/helpers';
import { DefaultUserData, IReadUser } from '@/schema/models';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<IReadUser> = (...errors) => ({
	ok: false,
	errors: errors,
	...DefaultUserData,
});

type IFunctionSignature = (otp: string) => Promise<ServerData<IReadUser>>;
export const verifyOtp: IFunctionSignature = async (otp) => {
	const t = await getTranslations();

	if (!otp || otp.length !== 6) return getDefaultData(t('lib.auth.otp.invalid'));

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
	if (response.status === 422)
		//	TODO: change message once otp tokens dont expire within 3 minutes, change to 'please resend otp'
		return getDefaultData(t('lib.auth.otp.expired'));
	if (rawData.detail) return getDefaultData(JSON.stringify(rawData.detail ?? ''));
	if (rawData.errors) return getDefaultData(...rawData.errors);
	if (!response.headers || response.headers.getSetCookie().length === 0)
		return getDefaultData(t('lib.noCookies'));

	//	Extract access and refresh tokens from the response cookies and delete otp cookie
	extractSessionCookies(response, (key, value, exp) => {
		cookieStore.set(key, value, {
			httpOnly: true,
			secure: true,
			expires: exp, // Convert milliseconds to seconds
			sameSite: 'lax',
			path: '/',
		});
	});

	return {
		...rawData,
		ok: true,
	} as ServerData<IReadUser>;
};
