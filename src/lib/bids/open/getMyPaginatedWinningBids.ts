'use server';

import { camelCase } from 'change-case/keys';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { IBidData } from '@/schema/models';
import { IOffsetPagination, OffsetPaginatedData } from '@/types';

export interface IGetMyPaginatedWinningBidsOptions extends IOffsetPagination {
	auctionId: string;
}

const getDefaultData: (...errors: Array<string>) => OffsetPaginatedData<IBidData> = (
	...errors
) => ({
	ok: false,
	errors: errors,
	results: [] as Array<IBidData>,
	page: 1,
	pageCount: 1,
	totalCount: 0,
	perPage: 10,
	resultCount: 0,
});

type IFunctionSignature = (
	options: IGetMyPaginatedWinningBidsOptions,
) => Promise<OffsetPaginatedData<IBidData>>;
export const getMyPaginatedWinningBids: IFunctionSignature = cache(
	async ({ auctionId, page, perPage }) => {
		const cookieHeaders = await getSession();
		if (!cookieHeaders) return getDefaultData('You must be logged in to access this resource.');
		const querySettings: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Cookie: cookieHeaders,
			},
		};

		const queryUrl = new URL('/v1/bids/o/winning/me', process.env.NEXT_PUBLIC_BACKEND_URL);
		queryUrl.searchParams.append('auction_id', auctionId);
		if (page) queryUrl.searchParams.append('page', page.toString());
		if (perPage) queryUrl.searchParams.append('per_page', perPage.toString());

		const response = await fetch(queryUrl, querySettings);
		const rawData = camelCase(await response.json(), 5) as
			| OffsetPaginatedData<unknown>
			| Array<IBidData>;

		//	If theres an issue, return the default data with errors
		if (!rawData) return getDefaultData('No data was returned.');
		if (!Array.isArray(rawData) && rawData.detail) return getDefaultData(rawData.detail ?? '');
		if (!Array.isArray(rawData) && rawData.errors) return getDefaultData(...rawData.errors);

		//	Parse results using schema and collect issues
		const errors: Array<string> = [];
		const results = (rawData as Array<IBidData>).reduce<Array<IBidData>>((acc, result) => {
			acc.push(result);
			return acc;
		}, []);

		return {
			ok: errors.length === 0,
			results,
			errors,
			perPage: results.length,
			page: 1,
			pageCount: 1,
			totalCount: results.length,
			resultCount: results.length,
		};
	},
);

//	@ts-expect-error - Preload doesn't return anything but signature requires a return
export const preloadMyPaginatedWinningBids: IFunctionSignature = async (options) => {
	void getMyPaginatedWinningBids(options);
};
