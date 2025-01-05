import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
	const res = NextResponse.next();
	await createSession(request, res);

	return res;
}

export const config = {};
