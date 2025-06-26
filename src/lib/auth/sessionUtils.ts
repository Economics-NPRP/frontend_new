import { camelCase } from 'change-case/keys';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

import { extractSessionCookies } from '@/helpers';

const DEV_LOGIN = new FormData();
DEV_LOGIN.append('username', process.env.SUPERUSER_EMAIL!);
DEV_LOGIN.append('password', process.env.SUPERUSER_PASSWORD!);

export const createSession = async (req: NextRequest, res: NextResponse) => {
	//	Login as superuser for development purposes
	const queryUrl = new URL('/dev/auth/login', process.env.NEXT_PUBLIC_BACKEND_URL);
	const response = await fetch(queryUrl, {
		method: 'POST',
		body: DEV_LOGIN,
	});

	if (!response.ok) return response;
	if (!response.headers || response.headers.getSetCookie().length === 0) return response;

	//	Take cookies from backend and set them in the frontend
	extractSessionCookies(response, (key, value, exp) => {
		res.cookies.set(key, value, {
			httpOnly: true,
			secure: true,
			expires: exp,
			sameSite: 'lax',
			path: '/',
		});
	});
};

interface IValidationResponse {
	isAuthenticated: boolean;
	refreshed: boolean;
	userId: string;
	role: string;
	message: string;
	error: string | null;
}
export const verifySession = async (req: NextRequest, res: NextResponse) => {
	const accessToken = req.cookies.get('ets_access_token');
	const refreshToken = req.cookies.get('ets_refresh_token');

	//	Initial check for tokens
	if (!accessToken || !refreshToken) return null;

	//	Validate the tokens by sending to server
	let sessionCookie =
		req.cookies.get('ets_session')?.value ||
		`ets_access_token=${accessToken.value}; ets_refresh_token=${refreshToken.value}`;
	const queryUrl = new URL('/v1/auth/validate', process.env.NEXT_PUBLIC_BACKEND_URL);
	const response = await fetch(queryUrl, {
		method: 'GET',
		headers: {
			Cookie: sessionCookie,
		},
	});

	if (!response.ok) return null;

	const data = camelCase(await response.json(), 5) as IValidationResponse;
	if (!data.isAuthenticated) return null;

	if (data.refreshed) {
		const cookies = extractSessionCookies(response, (key, value, exp) => {
			res.cookies.set(key, value, {
				httpOnly: true,
				secure: true,
				expires: exp,
				sameSite: 'lax',
				path: '/',
			});
		});
		sessionCookie = cookies[0].value;
	}

	return sessionCookie;
};

export const getSession = async () => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get('ets_session');
	if (!sessionCookie) return null;

	//	Extract access and refresh tokens from the session cookie
	const [accessToken, refreshToken] = sessionCookie.value
		.split('; ')
		.map((cookie) => cookie.split('=')[1]);

	//	Verify the tokens validity
	if (!accessToken || !refreshToken) return null;
	const { exp: accessExp } = jwtDecode(accessToken);
	const { exp: refreshExp } = jwtDecode(refreshToken);

	//	If the access or refresh token is expired, return null
	if ((accessExp || 0) < Date.now() / 1000 || (refreshExp || 0) < Date.now() / 1000) return null;

	return sessionCookie?.value;
};
