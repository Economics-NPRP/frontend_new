'use server';

import { headers } from 'next/headers';

/**
 * Build an absolute same-origin URL for server-side fetches.
 * Accepts absolute URLs and returns them unchanged.
 * Uses INTERNAL_BACKEND_URL for API calls when running in Docker container.
 */
export async function internalUrl(path: string): Promise<string> {
	if (/^https?:\/\//i.test(path)) return path;

	const cleaned = path.startsWith('/') ? path : `/${path}`;
	const h = await headers();
	const proto = h.get('x-forwarded-proto') || (process.env.VERCEL ? 'https' : 'http');
	const host =
		h.get('x-forwarded-host') ||
		h.get('host') ||
		process.env.NEXT_PUBLIC_HOST ||
		'localhost:3000';

	// For our API routes, if INTERNAL_NEXT_ORIGIN is defined, always use it (works in dev/prod builds inside Docker).
	// Otherwise, fall back to same-origin derived from forwarded headers.
	if (cleaned.startsWith('/api/proxy') || cleaned.startsWith('/api/dev')) {
		const origin = process.env.INTERNAL_NEXT_ORIGIN;
		if (origin) return `${origin}${cleaned}`;
		return `${proto}://${host}${cleaned}`;
	}

	return `${proto}://${host}${cleaned}`;
}
