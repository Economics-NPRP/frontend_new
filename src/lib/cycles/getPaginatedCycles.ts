'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { AuctionCycleStatus, IAuctionCycleData } from '@/schema/models';
import { IOffsetPagination, OffsetPaginatedData, SortDirection } from '@/types';

export interface IGetPaginatedCyclesOptions extends IOffsetPagination {
	sortBy?: string | null;
	sortDirection?: SortDirection | null;

	status?: AuctionCycleStatus;
}

const getDefaultData: (...errors: Array<string>) => OffsetPaginatedData<IAuctionCycleData> = (
	...errors
) => ({
	ok: false,
	errors: errors,
	results: [] as Array<IAuctionCycleData>,
	page: 1,
	pageCount: 1,
	totalCount: 0,
	perPage: 12,
	resultCount: 0,
});

type IFunctionSignature = (
	options: IGetPaginatedCyclesOptions,
) => Promise<OffsetPaginatedData<IAuctionCycleData>>;
export const getPaginatedCycles: IFunctionSignature = cache(
	async ({ page, perPage, sortBy, sortDirection, status }) => {
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

		const queryUrl = new URL('/v1/cycles/', process.env.NEXT_PUBLIC_BACKEND_URL);
		if (page) queryUrl.searchParams.append('page', page.toString());
		if (perPage) queryUrl.searchParams.append('per_page', perPage.toString());
		if (sortBy) queryUrl.searchParams.append('order_by', sortBy);
		if (sortDirection) queryUrl.searchParams.append('order_dir', sortDirection);
		if (status) queryUrl.searchParams.append('status', status);

		const response = await fetch(queryUrl, querySettings);
		const rawData = camelCase(await response.json(), 5) as OffsetPaginatedData<unknown>;

		//	If theres an issue, return the default data with errors
		if (!rawData) return getDefaultData(t('lib.noData'));
		if (rawData.detail) return getDefaultData(rawData.detail ?? '');
		if (rawData.errors) return getDefaultData(...rawData.errors);

		//	Parse results using schema and collect issues
		const errors: Array<string> = [];
		const results = rawData.results.reduce<Array<IAuctionCycleData>>((acc, result) => {
			acc.push(result as IAuctionCycleData);
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
export const preloadPaginatedCycles: IFunctionSignature = async (options) => {
	void getPaginatedCycles(options);
};
