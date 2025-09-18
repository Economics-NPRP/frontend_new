'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl } from '@/helpers';
import { IBidData } from '@/schema/models';
import { IOffsetPagination, OffsetPaginatedData } from '@/types';

export interface IGetPaginatedWinningBidsOptions extends IOffsetPagination {
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
	options: IGetPaginatedWinningBidsOptions,
) => Promise<OffsetPaginatedData<IBidData>>;
export const getPaginatedWinningBids: IFunctionSignature = cache(
	async ({ auctionId, page, perPage }) => {
		const t = await getTranslations();

		const cookieStore = await cookies();
		const access = cookieStore.get('ets_access_token')?.value;
		const refresh = cookieStore.get('ets_refresh_token')?.value;
		const cookieHeaders =
			access && refresh ? `ets_access_token=${access}; ets_refresh_token=${refresh}` : '';
		if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));
		const querySettings: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Cookie: cookieHeaders,
				...(await (async () => {
					try {
						const h = await headers();
						const xff = h.get('x-forwarded-for') || h.get('x-real-ip');
						return xff ? { 'X-Forwarded-For': xff } : {};
					} catch {
						return {} as Record<string, string>;
					}
				})()),
			},
		};

		const params = new URLSearchParams();
		params.append('auction_id', auctionId);
		if (page) params.append('page', page.toString());
		if (perPage) params.append('per_page', perPage.toString());
		const response = await fetch(
			await internalUrl(`/api/proxy/v1/bids/o/winning?${params.toString()}`),
			querySettings,
		);
		const rawData = camelCase(await response.json(), 5) as OffsetPaginatedData<unknown>;

		//	If theres an issue, return the default data with errors
		if (!rawData) return getDefaultData(t('lib.noData'));
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
export const preloadPaginatedWinningBids: IFunctionSignature = async (options) => {
	void getPaginatedWinningBids(options);
};
