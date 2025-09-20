'use server';

import { headers } from 'next/headers';

/**
 * Build an absolute same-origin URL for server-side fetches.
 * Accepts absolute URLs and returns them unchanged.
 * Uses INTERNAL_BACKEND_URL for API calls when running in Docker container.
 */
export async function internalUrl(path: string): Promise<string> {
	if (/^https?:\/\//i.test(path)) return path;

	// Always hit the local Next server for API routes we own,
	// so the proxy handler can forward to the backend.
	// This avoids DNS issues like ENOTFOUND platform.localhost inside containers.
	const cleaned = path.startsWith('/') ? path : `/${path}`;
	if (cleaned.startsWith('/api/proxy') || cleaned.startsWith('/api/dev')) {
		const origin = process.env.INTERNAL_NEXT_ORIGIN || 'http://127.0.0.1:3000';
		return `${origin}${cleaned}`;
	}

	const h = await headers();
	const proto = h.get('x-forwarded-proto') || (process.env.VERCEL ? 'https' : 'http');
	const host =
		h.get('x-forwarded-host') ||
		h.get('host') ||
		process.env.NEXT_PUBLIC_HOST ||
		'localhost:3000';
	return `${proto}://${host}${cleaned}`;
}
