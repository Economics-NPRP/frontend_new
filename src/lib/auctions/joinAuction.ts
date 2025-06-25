'use server';

import { camelCase } from 'change-case/keys';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { OffsetPaginatedData, ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<{}> = (...errors) => ({
	ok: false,
	errors: errors,
});

// Accept auctionType as a second parameter (default to 'open' for backward compatibility)
type IFunctionSignature = (auctionId: string, auctionType?: 'open' | 'sealed') => Promise<ServerData<{}>>;
export const joinAuction: IFunctionSignature = cache(async (auctionId, auctionType = 'open') => {
	const cookieHeaders = await getSession();
	if (!cookieHeaders) return getDefaultData('You must be logged in to access this resource.');
	const querySettings: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookieHeaders,
		},
	};

	// Select the correct endpoint based on auction type
	const joinPath = auctionType === 'sealed' ? '/v1/auctions/s/join/' : '/v1/auctions/o/join/';
	const queryUrl = new URL(joinPath, process.env.NEXT_PUBLIC_BACKEND_URL);
	queryUrl.searchParams.append('auction_id', auctionId);

	const response = await fetch(queryUrl, querySettings);
	const rawData = camelCase(await response.json(), 5) as OffsetPaginatedData<unknown>;

	//	If theres an issue, return the default data with errors
	if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	return {
		ok: true,
	};
});
