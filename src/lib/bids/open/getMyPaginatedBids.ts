'use server';

import { camelCase } from 'change-case/keys';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { IBidData } from '@/schema/models';
import { IOffsetPagination, OffsetPaginatedData } from '@/types';

export interface IGetMyPaginatedBidsOptions extends IOffsetPagination {
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
	options: IGetMyPaginatedBidsOptions,
) => Promise<OffsetPaginatedData<IBidData>>;
export const getMyPaginatedBids: IFunctionSignature = cache(
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
		queryUrl.searchParams.append('auctionId', auctionId);
		if (page) queryUrl.searchParams.append('page', page.toString());
		if (perPage) queryUrl.searchParams.append('perPage', perPage.toString());

		const response = await fetch(queryUrl, querySettings);
		const rawData = camelCase(await response.json(), 5) as OffsetPaginatedData<unknown>;

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
export const preloadMyPaginatedBids: IFunctionSignature = async (options) => {
	void getMyPaginatedBids(options);
};
