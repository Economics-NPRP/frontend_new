import type { NextRequest } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL as string | undefined;

function buildTargetUrl(req: NextRequest, _path: string[]) {
	if (!BACKEND) throw new Error('NEXT_PUBLIC_BACKEND_URL not set');
	const url = new URL(req.url);
	// Preserve the exact path (including trailing slash) after /api/proxy
	const proxyPrefix = '/api/proxy';
	let suffix = url.pathname.startsWith(proxyPrefix)
		? url.pathname.slice(proxyPrefix.length)
		: url.pathname;
	// Ensure suffix starts with '/'
	if (!suffix.startsWith('/')) suffix = `/${suffix}`;
	const base = BACKEND.endsWith('/') ? BACKEND.slice(0, -1) : BACKEND;
	return `${base}${suffix}${url.search}`;
}

// Follow backend redirects manually to preserve Set-Cookie and avoid surfacing 30x to callers
async function fetchFollowingRedirects(
	input: RequestInfo | URL,
	init: RequestInit,
	maxRedirects = 5,
) {
	let url = typeof input === 'string' ? input : input.toString();
	let method = (init.method || 'GET').toUpperCase();
	let body = init.body;
	const headers = init.headers as Record<string, string>;
	const setCookieAccum: string[] = [];

	for (let i = 0; i < maxRedirects; i++) {
		const resp = await fetch(url, { ...init, method, body, redirect: 'manual' });

		const status = resp.status;
		const location = resp.headers.get('location');

		// Collect any Set-Cookie headers on the way
		const sc = resp.headers.getSetCookie?.() || [];
		for (const c of sc) setCookieAccum.push(c);

		if (location && [301, 302, 303, 307, 308].includes(status)) {
			// Resolve relative redirects against current URL
			const resolved = /^https?:\/\//i.test(location)
				? location
				: new URL(location, url).toString();

			// For 301/302/303 switch to GET and drop body per spec if not HEAD
			if ([301, 302, 303].includes(status) && method !== 'HEAD') {
				method = 'GET';
				body = undefined;
			}

			url = resolved;
			continue;
		}

		// Build final response mirroring headers and accumulated cookies
		const respHeaders = new Headers();
		const rct = resp.headers.get('content-type');
		if (rct) respHeaders.set('content-type', rct);
		const rcl = resp.headers.get('content-length');
		if (rcl) respHeaders.set('content-length', rcl);
		for (const c of setCookieAccum) respHeaders.append('set-cookie', c);

		return new Response(resp.body, { status: resp.status, headers: respHeaders });
	}

	return new Response('Too many redirects', { status: 508 });
}

// Use `any` for context to align with Next's generated RouteContext types in .next/types
async function forward(req: NextRequest, ctx: any) {
	const context = await ctx
	const contextParams = await context.params
	const path = contextParams?.path || []
	const target = buildTargetUrl(req, path);

	const incoming = req.headers;
	const headers: Record<string, string> = {};

	// Forward allowed headers
	const cookie = incoming.get('cookie');
	const ct = incoming.get('content-type');
	const accept = incoming.get('accept');
	if (cookie) headers['cookie'] = cookie;
	if (ct) headers['content-type'] = ct;
	if (accept) headers['accept'] = accept;

	// Forward IP headers for token IP-binding
	const xff = incoming.get('x-forwarded-for');
	const cfip = incoming.get('cf-connecting-ip');
	const xreal = incoming.get('x-real-ip');
	if (xff) headers['X-Forwarded-For'] = xff;
	if (cfip) headers['CF-Connecting-IP'] = cfip;
	if (xreal) headers['X-Real-IP'] = xreal;

	const method = req.method;
	const hasBody = !['GET', 'HEAD'].includes(method);
	const body = hasBody ? await req.arrayBuffer() : undefined;

	return fetchFollowingRedirects(target, { method, headers, body, redirect: 'manual' });
}

export function GET(req: NextRequest, ctx: any) {
	return forward(req, ctx);
}
export function POST(req: NextRequest, ctx: any) {
	return forward(req, ctx);
}
export function PUT(req: NextRequest, ctx: any) {
	return forward(req, ctx);
}
export function PATCH(req: NextRequest, ctx: any) {
	return forward(req, ctx);
}
export function DELETE(req: NextRequest, ctx: any) {
	return forward(req, ctx);
}
export function HEAD(req: NextRequest, ctx: any) {
	return forward(req, ctx);
}
export function OPTIONS(req: NextRequest, ctx: any) {
	return forward(req, ctx);
}
