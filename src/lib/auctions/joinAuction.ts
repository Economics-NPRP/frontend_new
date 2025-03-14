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

type IFunctionSignature = (auctionId: string) => Promise<ServerData<{}>>;
export const joinAuction: IFunctionSignature = cache(async (auctionId) => {
	const cookieHeaders = await getSession();
	if (!cookieHeaders) return getDefaultData('You must be logged in to access this resource.');
	const querySettings: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookieHeaders,
		},
	};

	const queryUrl = new URL('/v1/auctions/o/join/', process.env.NEXT_PUBLIC_BACKEND_URL);
	queryUrl.searchParams.append('auctionId', auctionId);

	const response = await fetch(queryUrl, querySettings);
	const rawData = camelCase(await response.json(), 5) as OffsetPaginatedData<unknown>;

	//	If theres an issue, return the default data with errors
	if (!rawData) return getDefaultData('No data was returned.');
	if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	return {
		ok: true,
	};
});
