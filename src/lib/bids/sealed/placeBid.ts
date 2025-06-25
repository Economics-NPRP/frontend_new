'use server';

import { camelCase } from 'change-case/keys';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { ICreateBid } from '@/schema/models';
import { ServerData } from '@/types';

export interface IPlaceBidOptions {
	auctionId: string;
	bids: Array<ICreateBid>;
}

const getDefaultData: (...errors: Array<string>) => ServerData<{}> = (...errors) => ({
	ok: false,
	errors: errors,
});

type IFunctionSignature = (options: IPlaceBidOptions) => Promise<ServerData<{}>>;

export const placeBid: IFunctionSignature = cache(async ({ auctionId, bids }) => {
	const cookieHeaders = await getSession();
	if (!cookieHeaders) return getDefaultData('You must be logged in to access this resource.');
	const querySettings: RequestInit = {
		method: 'POST',
		body: JSON.stringify(bids),
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookieHeaders,
		},
	};

	const queryUrl = new URL('/v1/bids/s/place/', process.env.NEXT_PUBLIC_BACKEND_URL);
	queryUrl.searchParams.append('auction_id', auctionId);

	const response = await fetch(queryUrl, querySettings);
	const rawData = camelCase(await response.json(), 5) as ServerData<{}>;

	//	If theres an issue, return the default data with errors
	if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	return {
		ok: true,
	};
});

// Example placeholder for sealed auction bid placement
export interface PlaceBidOptions {
	auctionId: string;
	amount: number;
	// ...other options
}

export async function placeSealedBid(options: PlaceBidOptions): Promise<any> { // Replace 'any' with your actual return type
	// Implement sealed bid placement logic here
	const response = await fetch('/v1/bids/s/place/', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(options),
	});
	return response.json();
} 