import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

const DEV_LOGIN = new FormData();
DEV_LOGIN.append('username', process.env.SUPERUSER_EMAIL!);
DEV_LOGIN.append('password', process.env.SUPERUSER_PASSWORD!);

const saveCookies = (response: Response, res: NextResponse) => {
	let accessToken = '',
		refreshToken = '',
		sessionExp = 0;
	const cookieList = response.headers.getSetCookie();
	cookieList.forEach((cookie) => {
		const [key, value] = cookie.split('; ')[0].split('=');
		const { exp } = jwtDecode(value);
		res.cookies.set(key, value, {
			httpOnly: true,
			secure: true,
			expires: Date.now() + (exp || 0),
			sameSite: 'lax',
			path: '/',
		});

		if (key === 'ets_refresh_token') refreshToken = value;
		else if (key === 'ets_access_token') {
			accessToken = value;
			//	Use the expiration time of the access token as session expiration time
			sessionExp = Date.now() + (exp || 0);
		}
	});

	return {
		sessionCookie: `ets_access_token=${accessToken}; ets_refresh_token=${refreshToken}`,
		sessionExp,
	};
};

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
	const { sessionCookie, sessionExp } = saveCookies(response, res);
	res.cookies.set('ets_session', sessionCookie, {
		httpOnly: true,
		secure: true,
		expires: sessionExp,
		sameSite: 'lax',
		path: '/',
	});
};

export const verifySession = async (req: NextRequest, res: NextResponse) => {
	const accessToken = req.cookies.get('ets_access_token');
	const refreshToken = req.cookies.get('ets_refresh_token');

	//	Initial check for tokens
	if (!accessToken || !refreshToken) return null;

	//	Check with the server and refresh the tokens
	const initialSessionCookie = `ets_access_token=${accessToken.value}; ets_refresh_token=${refreshToken.value}`;
	const queryUrl = new URL('/v1/auth/refresh', process.env.NEXT_PUBLIC_BACKEND_URL);
	const response = await fetch(queryUrl, {
		method: 'POST',
		headers: {
			Cookie: initialSessionCookie,
		},
	});

	//	If the response is not ok, return null
	if (!response.ok) return null;

	//	In all other cases, return the session cookie
	const { sessionCookie, sessionExp } = saveCookies(response, res);
	res.cookies.set('ets_session', sessionCookie, {
		httpOnly: true,
		secure: true,
		expires: sessionExp,
		sameSite: 'lax',
		path: '/',
	});
	return sessionCookie;
};

export const getSession = async () => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get('ets_session');
	if (!sessionCookie) return null;
	return sessionCookie?.value;
};
