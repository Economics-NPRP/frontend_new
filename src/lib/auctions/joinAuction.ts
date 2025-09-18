'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl } from '@/helpers';
import { OffsetPaginatedData, ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<{}> = (...errors) => ({
	ok: false,
	errors: errors,
});

type IFunctionSignature = (auctionId: string) => Promise<ServerData<{}>>;
export const joinAuction: IFunctionSignature = cache(async (auctionId) => {
	const t = await getTranslations();

	// Build auth cookie header from incoming request cookies
	const cookieStore = await cookies();
	const access = cookieStore.get('ets_access_token')?.value;
	const refresh = cookieStore.get('ets_refresh_token')?.value;
	const cookieHeader =
		access && refresh ? `ets_access_token=${access}; ets_refresh_token=${refresh}` : '';

	// Optionally forward client IP for IP-bound tokens
	let xff: string | null = null;
	try {
		const h = await headers();
		xff = h.get('x-forwarded-for') || h.get('x-real-ip');
	} catch {}

	const querySettings: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(cookieHeader ? { Cookie: cookieHeader } : {}),
			...(xff ? { 'X-Forwarded-For': xff } : {}),
		},
	};

	// Use internal proxy (same-origin) for consistent cookie forwarding
	const response = await fetch(
		await internalUrl(`/api/proxy/v1/auctions/o/join?auction_id=${auctionId}`),
		querySettings as RequestInit,
	);
	const rawData = camelCase(await response.json(), 5) as OffsetPaginatedData<unknown>;

	//	If theres an issue, return the default data with errors
	if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	return {
		ok: true,
	};
});
