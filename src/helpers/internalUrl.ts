'use server';

import { headers } from 'next/headers';

/**
 * Build an absolute same-origin URL for server-side fetches.
 * Accepts absolute URLs and returns them unchanged.
 */
export async function internalUrl(path: string): Promise<string> {
	if (/^https?:\/\//i.test(path)) return path;
	const h = await headers();
	const proto = h.get('x-forwarded-proto') || (process.env.VERCEL ? 'https' : 'http');
	const host =
		h.get('x-forwarded-host') ||
		h.get('host') ||
		process.env.NEXT_PUBLIC_HOST ||
		'localhost:3000';
	const cleaned = path.startsWith('/') ? path : `/${path}`;
	return `${proto}://${host}${cleaned}`;
}
