'use server';

import { camelCase } from 'change-case/keys';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { IBidData } from '@/schema/models';
import { IKeysetPagination, KeysetPaginatedData } from '@/types';

export interface IGetPaginatedBidsOptions extends IKeysetPagination {
	auctionId: string;
	bidId?: string;
}

const getDefaultData: (...errors: Array<string>) => KeysetPaginatedData<IBidData> = (
	...errors
) => ({
	ok: false,
	errors: errors,
	results: [] as Array<IBidData>,
	perPage: 10,
	hasNext: false,
	totalCount: 0,
	isExact: true,
	resultCount: 0,
});

type IFunctionSignature = (
	options: IGetPaginatedBidsOptions,
) => Promise<KeysetPaginatedData<IBidData>>;
export const getPaginatedBids: IFunctionSignature = cache(
	async ({ auctionId, bidId, perPage, navDirection }) => {
		const cookieHeaders = await getSession();
		if (!cookieHeaders) return getDefaultData('You must be logged in to access this resource.');
		const querySettings: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Cookie: cookieHeaders,
			},
		};

		const queryUrl = new URL('/v1/bids/o/', process.env.NEXT_PUBLIC_BACKEND_URL);
		queryUrl.searchParams.append('auction_id', auctionId);
		if (bidId) queryUrl.searchParams.append('bid_id', bidId.toString());
		if (perPage) queryUrl.searchParams.append('per_page', perPage.toString());
		if (navDirection) queryUrl.searchParams.append('nav_direction', navDirection.toString());

		const response = await fetch(queryUrl, querySettings);
		const rawData = camelCase(await response.json(), 5) as KeysetPaginatedData<unknown>;

		//	If theres an issue, return the default data with errors
		if (!rawData) return getDefaultData('No data was returned.');
		if (rawData.detail) return getDefaultData(rawData.detail ?? '');
		if (rawData.errors) return getDefaultData(...rawData.errors);

		//	Parse results using schema and collect issues
		const errors: Array<string> = [];
		const results = rawData.results.reduce<Array<IBidData>>((acc, result) => {
			acc.push(result as IBidData);
			return acc;
		}, []);

		return {
			...rawData,
			ok: errors.length === 0,
			results,
			errors,
		};
	},
);

//	@ts-expect-error - Preload doesn't return anything but signature requires a return
export const preloadPaginatedBids: IFunctionSignature = async (options) => {
	void getPaginatedBids(options);
};
