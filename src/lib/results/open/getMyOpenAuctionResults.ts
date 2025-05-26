'use server';

import { camelCase } from 'change-case/keys';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { DefaultMyAuctionResultsData, IMyAuctionResultsData, ServerData } from '@/types';

export interface IGetMyOpenAuctionResultsOptions {
	auctionId: string;
}

const getDefaultData: (...errors: Array<string>) => ServerData<IMyAuctionResultsData> = (
	...errors
) => ({
	...DefaultMyAuctionResultsData,
	ok: false,
	errors: errors,
});

type IFunctionSignature = (auctionId: string) => Promise<ServerData<IMyAuctionResultsData>>;
export const getMyOpenAuctionResults: IFunctionSignature = cache(async (auctionId) => {
	const cookieHeaders = await getSession();
	if (!cookieHeaders) return getDefaultData('You must be logged in to access this resource.');
	const querySettings: RequestInit = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookieHeaders,
		},
	};

	const queryUrl = new URL('/v1/results/o/me/', process.env.NEXT_PUBLIC_BACKEND_URL);
	queryUrl.searchParams.append('auction_id', auctionId);

	const response = await fetch(queryUrl, querySettings);
	const rawData = camelCase(await response.json(), 5) as ServerData<IMyAuctionResultsData>;

	//	If theres an issue, return the default data with errors
	if (!rawData) return getDefaultData('No data was returned.');
	if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	//	TODO: Validate the data using schema
	return {
		...rawData,
		ok: true,
	} as ServerData<IMyAuctionResultsData>;
});

//	@ts-expect-error - Preload doesn't return anything but signature requires a return
export const preloadMyOpenAuctionResults: IFunctionSignature = async (options) => {
	void getMyOpenAuctionResults(options);
};
