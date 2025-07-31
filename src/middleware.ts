import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { ProtectedRoutes } from '@/constants/ProtectedRoutes';
import { verifySession } from '@/lib/auth/sessionUtils';

const otpRoute = '/otp';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();

	//	If the request is for the OTP route, redirect if user doesnt have otp token
	if (req.nextUrl.pathname.startsWith(otpRoute)) {
		const otpToken = req.cookies.get('ets_otp_token');
		if (!otpToken) return NextResponse.redirect(new URL('/login', req.url));
	}

	//	If this is not a protected route, return the response immediately
	if (!ProtectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) return res;

	//	If the user is not logged in, redirect to the login page
	const verified = await verifySession(req, res);
	if (!verified && process.env.NODE_ENV !== 'development')
		return NextResponse.redirect(new URL('/login', req.url));

	return res;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
