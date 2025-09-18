export async function GET(req: Request) {
	const cookie = req.headers.get('cookie') ?? '';
	const xff = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
	const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
	if (!backend) {
		return new Response(JSON.stringify({ error: 'NEXT_PUBLIC_BACKEND_URL not set' }), {
			status: 500,
			headers: { 'content-type': 'application/json' },
		});
	}

	const r = await fetch(`${backend}/v1/auth/validate`, {
		headers: { cookie, ...(xff ? { 'X-Forwarded-For': xff } : {}) },
		cache: 'no-store',
	});
	const body = await r.text();
	return new Response(body, {
		status: r.status,
		headers: { 'content-type': r.headers.get('content-type') ?? 'application/json' },
	});
}
