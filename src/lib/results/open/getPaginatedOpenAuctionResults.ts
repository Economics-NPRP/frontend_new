'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import {
	IAuctionResultsData,
	IOffsetPagination,
	OffsetPaginatedData,
	SortDirection,
} from '@/types';

export interface IGetPaginatedOpenAuctionResultsOptions extends IOffsetPagination {
	auctionId: string;

	sortBy?: string | null;
	sortDirection?: SortDirection | null;
}

const getDefaultData: (...errors: Array<string>) => OffsetPaginatedData<IAuctionResultsData> = (
	...errors
) => ({
	ok: false,
	errors: errors,
	results: [] as Array<IAuctionResultsData>,
	page: 1,
	pageCount: 1,
	totalCount: 0,
	perPage: 10,
	resultCount: 0,
});

type IFunctionSignature = (
	options: IGetPaginatedOpenAuctionResultsOptions,
) => Promise<OffsetPaginatedData<IAuctionResultsData>>;
export const getPaginatedOpenAuctionResults: IFunctionSignature = cache(
	async ({ auctionId, page, perPage, sortBy, sortDirection }) => {
		const t = await getTranslations();

		const cookieHeaders = await getSession();
		if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));
		const querySettings: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Cookie: cookieHeaders,
			},
		};

		const queryUrl = new URL('/v1/results/o', process.env.NEXT_PUBLIC_BACKEND_URL);
		queryUrl.searchParams.append('auction_id', auctionId);
		if (page) queryUrl.searchParams.append('page', page.toString());
		if (perPage) queryUrl.searchParams.append('per_page', perPage.toString());
		if (sortBy) queryUrl.searchParams.append('order_by', sortBy);
		if (sortDirection) queryUrl.searchParams.append('order_dir', sortDirection);

		const response = await fetch(queryUrl, querySettings);
		const rawData = camelCase(await response.json(), 5) as OffsetPaginatedData<unknown>;

		//	If theres an issue, return the default data with errors
		if (!rawData) return getDefaultData(t('lib.noData'));
		if (rawData.detail) return getDefaultData(rawData.detail ?? '');
		if (rawData.errors) return getDefaultData(...rawData.errors);

		//	Parse results using schema and collect issues
		const errors: Array<string> = [];
		const results = rawData.results.reduce<Array<IAuctionResultsData>>((acc, result) => {
			acc.push(result as IAuctionResultsData);
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
export const preloadPaginatedOpenAuctionResults: IFunctionSignature = async (options) => {
	void getPaginatedOpenAuctionResults(options);
};
