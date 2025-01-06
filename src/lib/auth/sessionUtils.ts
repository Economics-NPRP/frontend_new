import { jwtDecode } from 'jwt-decode';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

import { IAccessToken, IRefreshToken } from '@/types';
import { ipAddress } from '@vercel/functions';

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

	//	Add session cookie to the response
	res.cookies.set(
		'ets_session',
		`ets_access_token=${accessToken}; ets_refresh_token=${refreshToken}`,
		{
			httpOnly: true,
			secure: true,
			expires: sessionExp,
			sameSite: 'lax',
			path: '/',
		},
	);
};

//	TODO: move to separate util file
const getIpAddress = async (req: NextRequest) => {
	if (process.env.NODE_ENV === 'development') {
		const header = await headers();
		return header.get('x-forwarded-for') || header.get('x-real-ip') || '127.0.0.1';
	} else return ipAddress(req); //	Use the ipAddress function from @vercel/functions
};

export const verifySession = async (req: NextRequest, res: NextResponse) => {
	const accessToken = req.cookies.get('ets_access_token');
	const refreshToken = req.cookies.get('ets_refresh_token');

	//	Initial check for tokens
	if (!accessToken || !refreshToken) return null;

	//	Check if tokens are valid and belong to the same user
	const ip = await getIpAddress(req);
	const { jti: atJti, sub: atSub, exp: atExp } = jwtDecode<IAccessToken>(accessToken.value);
	const { jti: rtJti, sub: rtSub, ip: rtIp } = jwtDecode<IRefreshToken>(refreshToken.value);
	const sameJti = atJti === rtJti;
	const sameSub = atSub === rtSub;
	const sameIp = process.env.NODE_ENV === 'development' ? true : ip === rtIp;
	if (!sameJti || !sameSub || !sameIp) return null;

	//	In all other cases, return the session cookie
	const sessionCookie = `ets_access_token=${accessToken.value}; ets_refresh_token=${refreshToken.value}`;
	res.cookies.set('ets_session', sessionCookie, {
		httpOnly: true,
		secure: true,
		expires: Date.now() + (atExp || 0),
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
