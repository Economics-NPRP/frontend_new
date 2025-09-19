// Centralized cookie attributes for server-side cookie setting.
// Dev: SameSite=Lax, Secure=false, no Domain.
// Prod: SameSite=None, Secure=true, Domain from COOKIE_DOMAIN or DOMAIN (prefixed with a dot).

type CookieOptions = {
	httpOnly: boolean;
	secure: boolean;
	sameSite: 'lax' | 'strict' | 'none';
	path: string;
	expires?: number | Date;
	domain?: string;
};

// Determine prod-like based on domain config or backend URL, not just NODE_ENV.
const envDomain = (process.env.COOKIE_DOMAIN || process.env.DOMAIN || '').toLowerCase();
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
let backendHost = '';
try {
	if (backendUrl) backendHost = new URL(backendUrl).hostname.toLowerCase();
} catch {}
const hostForDecision = envDomain || backendHost;
const isLocalHost = /^(localhost|127\.0\.0\.1)$/.test(hostForDecision);
const isHttps = /^https:/i.test(backendUrl);
const isProdLike =
	!!hostForDecision && !isLocalHost && (isHttps || process.env.NODE_ENV === 'production');

function getCookieDomain(): string | undefined {
	if (!isProdLike) return undefined;
	const raw = process.env.COOKIE_DOMAIN || process.env.DOMAIN;
	let source = raw?.trim();
	if (!source) {
		// Derive parent domain from backend host (e.g., api.example.com -> example.com)
		const host = backendHost;
		if (!host) return undefined;
		const parts = host.split('.');
		if (parts.length >= 2) source = parts.slice(-2).join('.');
		else source = host;
	}
	const cleaned = source
		.replace(/^https?:\/\//, '')
		.replace(/:\d+$/, '')
		.trim();
	if (!cleaned || /^(localhost|127\.0\.0\.1)$/.test(cleaned)) return undefined;
	return cleaned.startsWith('.') ? cleaned : `.${cleaned}`;
}

export function getCookieOptions(expiresMs?: number): CookieOptions {
	const domain = getCookieDomain();
	return {
		httpOnly: true,
		secure: isProdLike,
		sameSite: isProdLike ? 'none' : 'lax',
		path: '/',
		...(typeof expiresMs === 'number' ? { expires: new Date(expiresMs) } : {}),
		...(domain ? { domain } : {}),
	};
}
