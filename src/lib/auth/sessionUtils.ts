import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

const DEV_LOGIN = new FormData();
DEV_LOGIN.append('username', process.env.SUPERUSER_EMAIL!);
DEV_LOGIN.append('password', process.env.SUPERUSER_PASSWORD!);

const QUERY_SETTINGS: RequestInit = {
	method: 'POST',
	body: DEV_LOGIN,
};

export const createSession = async (req: NextRequest, res: NextResponse) => {
	//	Login as superuser for development purposes
	const queryUrl = new URL('/dev/auth/login', process.env.NEXT_PUBLIC_BACKEND_URL);
	const response = await fetch(queryUrl, QUERY_SETTINGS);

	if (!response.ok) return response;
	if (!response.headers || response.headers.getSetCookie().length === 0) return response;

	//	Take cookies from backend and set them in the frontend
	const cookieList = response.headers.getSetCookie();
	cookieList.forEach((cookie) => {
		const [key, value] = cookie.split('; ')[0].split('=');
		const { exp } = jwtDecode(value);
		res.cookies.set(key, value, {
			httpOnly: true,
			secure: true,
			expires: exp,
			sameSite: 'lax',
			path: '/',
		});
	});
};

export const verifySession = async () => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('ets_access_token');
	const refreshToken = cookieStore.get('ets_refresh_token');

	if (!accessToken || !refreshToken) return null;
	else return `ets_access_token=${accessToken.value}; ets_refresh_token=${refreshToken.value}`;
};
