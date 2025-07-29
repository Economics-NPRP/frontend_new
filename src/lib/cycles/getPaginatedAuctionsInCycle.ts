'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { AuctionOwnershipFilter, AuctionTypeFilter, IAuctionData } from '@/schema/models';
import { IOffsetPagination, OffsetPaginatedData, SortDirection } from '@/types';

export interface IGetPaginatedAuctionsInCycleOptions extends IOffsetPagination {
	cycleId: string;

	sortBy?: string | null;
	sortDirection?: SortDirection | null;

	ownerId?: string;
	type?: AuctionTypeFilter;
	ownership?: AuctionOwnershipFilter;
	isPending?: boolean;
	isLive?: boolean;
	hasEnded?: boolean;
}

const getDefaultData: (...errors: Array<string>) => OffsetPaginatedData<IAuctionData> = (
	...errors
) => ({
	ok: false,
	errors: errors,
	results: [] as Array<IAuctionData>,
	page: 1,
	pageCount: 1,
	totalCount: 0,
	perPage: 12,
	resultCount: 0,
});

type IFunctionSignature = (
	options: IGetPaginatedAuctionsInCycleOptions,
) => Promise<OffsetPaginatedData<IAuctionData>>;
export const getPaginatedAuctionsInCycle: IFunctionSignature = cache(
	async ({
		cycleId,
		page,
		perPage,
		sortBy,
		sortDirection,
		ownerId,
		type,
		ownership,
		isPending,
		isLive,
		hasEnded,
	}) => {
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

		const queryUrl = new URL(
			`/v1/cycles/${cycleId}/auctions`,
			process.env.NEXT_PUBLIC_BACKEND_URL,
		);
		if (page) queryUrl.searchParams.append('page', page.toString());
		if (perPage) queryUrl.searchParams.append('per_page', perPage.toString());
		if (sortBy) queryUrl.searchParams.append('order_by', sortBy);
		if (sortDirection) queryUrl.searchParams.append('order_dir', sortDirection);
		if (ownerId) queryUrl.searchParams.append('owner', ownerId);
		if (type && type !== 'all') queryUrl.searchParams.append('type', type);
		if (ownership && ownership !== 'all')
			queryUrl.searchParams.append(
				'is_primary_market',
				ownership === 'government' ? 'true' : 'false',
			);
		if (isPending) queryUrl.searchParams.append('is_pending', isPending.valueOf().toString());
		if (isLive) queryUrl.searchParams.append('is_live', isLive.valueOf().toString());
		if (hasEnded) queryUrl.searchParams.append('has_ended', hasEnded.valueOf().toString());

		const response = await fetch(queryUrl, querySettings);
		const rawData = camelCase(await response.json(), 5) as OffsetPaginatedData<unknown>;

		//	If theres an issue, return the default data with errors
		if (!rawData) return getDefaultData(t('lib.noData'));
		if (rawData.detail) return getDefaultData(rawData.detail ?? '');
		if (rawData.errors) return getDefaultData(...rawData.errors);

		//	Parse results using schema and collect issues
		const errors: Array<string> = [];
		const results = rawData.results.reduce<Array<IAuctionData>>((acc, result) => {
			acc.push(result as IAuctionData);
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
export const preloadPaginatedAuctionsInCycle: IFunctionSignature = async (options) => {
	void getPaginatedAuctionsInCycle(options);
};
