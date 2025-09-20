export const toIsoUtcMicro = (input: Date | string = new Date()): string => {
	const pad2 = (n: number) => String(n).padStart(2, '0');

	// Normalize to a Date object in local time then output UTC components
	let d: Date;
	if (typeof input === 'string') {
		// Try native Date parsing first (handles ISO with timezone correctly)
		const parsed = Date.parse(input);
		if (!Number.isNaN(parsed)) {
			d = new Date(parsed);
		} else {
			// Fallback for 'YYYY-MM-DD HH:mm:ss' (assumed local time)
			const [datePart, timePart = '00:00:00'] = input.trim().split(' ');
			const [y, m, dd] = datePart.split('-').map((v) => parseInt(v, 10));
			const [hh, mm, ss] = timePart.split(':').map((v) => parseInt(v, 10));
			d = new Date(y, (m || 1) - 1, dd || 1, hh || 0, mm || 0, ss || 0, 0);
		}
	} else {
		d = new Date(input);
	}

	const year = d.getUTCFullYear();
	const month = pad2(d.getUTCMonth() + 1);
	const day = pad2(d.getUTCDate());
	const hour = pad2(d.getUTCHours());
	const minute = pad2(d.getUTCMinutes());
	const second = pad2(d.getUTCSeconds());
	const micro = String(d.getUTCMilliseconds() * 1000).padStart(6, '0');

	return `${year}-${month}-${day}T${hour}:${minute}:${second}.${micro}+00:00`;
};
