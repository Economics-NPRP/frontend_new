import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createSession, verifySession } from '@/lib/auth';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();

	const verified = await verifySession(req, res);
	if (!verified) await createSession(req, res);

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
