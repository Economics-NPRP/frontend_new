'use client';

import { useState } from 'react';

export default function DebugAuth() {
	const [out, setOut] = useState<any>(null);
	const [busy, setBusy] = useState(false);

	const call = async (path: string) => {
		setBusy(true);
		try {
			const res = await fetch(path, { credentials: 'include' });
			const json = await res.json().catch(() => null);
			setOut({ path, ok: res.ok, status: res.status, json });
		} finally {
			setBusy(false);
		}
	};

	return (
		<div style={{ padding: 16, display: 'grid', gap: 12 }}>
			<h2>Debug Auth</h2>
			<div style={{ display: 'flex', gap: 8 }}>
				<button disabled={busy} onClick={() => call('/api/dev/validate')}>
					Validate via proxy
				</button>
				<button
					disabled={busy}
					onClick={() => call(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/validate`)}
				>
					Validate direct
				</button>
			</div>
			<pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(out, null, 2)}</pre>
		</div>
	);
}
