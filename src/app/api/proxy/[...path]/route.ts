import type { NextRequest } from 'next/server';

const BACKEND = (process.env.INTERNAL_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL) as
	| string
	| undefined;

function buildTargetUrl(req: NextRequest) {
	if (!BACKEND) throw new Error('NEXT_PUBLIC_BACKEND_URL not set');
	const url = new URL(req.url);
	const proxyPrefix = '/api/proxy';
	let suffix = url.pathname.startsWith(proxyPrefix)
		? url.pathname.slice(proxyPrefix.length)
		: url.pathname;
	if (!suffix.startsWith('/')) suffix = `/${suffix}`;

	// Normalize known collection index endpoints to include trailing slash
	const needsSlash = [
		/^\/v\d+\/[A-Za-z0-9_-]+$/, // /v1/cycles, /v1/sectors, /v1/auctions
		/^\/v\d+\/users\/(firms|admins)$/,
		/^\/v\d+\/users\/firms\/applications$/,
		/^\/v\d+\/auctions\/(o|s)$/,
		/^\/v\d+\/bids\/(o|s)$/,
		/^\/v\d+\/results\/(o|s)$/,
	].some((re) => re.test(suffix));
	if (needsSlash && !suffix.endsWith('/')) {
		const before = suffix;
		suffix = `${suffix}/`;
		try {
			console.log(`[proxy] normalized index path: ${before} -> ${suffix}`);
		} catch {}
	}

	const base = BACKEND.endsWith('/') ? BACKEND.slice(0, -1) : BACKEND;
	return `${base}${suffix}${url.search}`;
}

async function forward(req: NextRequest): Promise<Response> {
	const target0 = buildTargetUrl(req);

	// Build forward headers
	const incoming = req.headers;
	const headers: Record<string, string> = {};
	const cookie = incoming.get('cookie');
	const ct = incoming.get('content-type');
	const accept = incoming.get('accept');
	const auth = incoming.get('authorization');
	if (cookie) headers['cookie'] = cookie;
	if (ct) headers['content-type'] = ct;
	if (accept) headers['accept'] = accept;
	if (auth) headers['authorization'] = auth;

	// Propagate client IP-ish headers (best-effort)
	const xff = incoming.get('x-forwarded-for');
	const xreal = incoming.get('x-real-ip');
	if (xff) headers['X-Forwarded-For'] = xff;
	if (xreal) headers['X-Real-IP'] = xreal;

	let method = req.method.toUpperCase();
	let body: BodyInit | undefined = !['GET', 'HEAD'].includes(method)
		? await req.arrayBuffer()
		: undefined;

	// Follow up to 3 redirects manually to avoid surfacing 307 loops
	let currentUrl = target0;
	let resp: Response | null = null;
	for (let i = 0; i < 3; i++) {
		resp = await fetch(currentUrl, {
			method,
			headers,
			body,
			redirect: 'manual',
		});
		const status = resp.status;
		const loc = resp.headers.get('location');
		if (loc && [301, 302, 303, 307, 308].includes(status)) {
			const resolved = /^https?:\/\//i.test(loc) ? loc : new URL(loc, currentUrl).toString();
			// 303 forces GET (body dropped)
			if (status === 303 && method !== 'GET' && method !== 'HEAD') {
				method = 'GET';
				body = undefined;
			}
			currentUrl = resolved;
			// Continue to next hop
			continue;
		}
		break;
	}

	const final = resp ?? new Response('Bad Gateway', { status: 502 });
	try {
		console.log(`[proxy] ${req.method} ${target0} => ${final.status}`);
	} catch {}

	// Filter hop-by-hop headers and preserve multiple Set-Cookie if present
	const hopByHop = new Set([
		'connection',
		'keep-alive',
		'proxy-authenticate',
		'proxy-authorization',
		'te',
		'trailer',
		'transfer-encoding',
		'upgrade',
	]);

	const outHeaders = new Headers();
	final.headers.forEach((value, key) => {
		if (!hopByHop.has(key.toLowerCase())) outHeaders.set(key, value);
	});
	const anyHeaders: any = final.headers as any;
	if (typeof anyHeaders.getSetCookie === 'function') {
		const cookies: string[] = anyHeaders.getSetCookie();
		if (cookies && cookies.length) {
			outHeaders.delete('set-cookie');
			for (const c of cookies) outHeaders.append('set-cookie', c);
		}
	}

	return new Response(final.body, { status: final.status, headers: outHeaders });
}

export function GET(req: NextRequest) {
	return forward(req);
}
export function POST(req: NextRequest) {
	return forward(req);
}
export function PUT(req: NextRequest) {
	return forward(req);
}
export function PATCH(req: NextRequest) {
	return forward(req);
}
export function DELETE(req: NextRequest) {
	return forward(req);
}
export function HEAD(req: NextRequest) {
	return forward(req);
}
export function OPTIONS(req: NextRequest) {
	return forward(req);
}
