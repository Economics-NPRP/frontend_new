'use server';

import { cache } from 'react';
import 'server-only';
import { parse, safeParse } from 'valibot';

import { getSession } from '@/lib/auth';
import { AuctionType, IAuctionData, ReadAuctionDataSchema } from '@/schema/models';
import { IOffsetPagination, OffsetPaginatedData, SortDirection } from '@/types';

export interface IGetPaginatedAuctionsOptions extends IOffsetPagination {
	sortBy?: string;
	sortDirection?: SortDirection;

	ownerId?: string;
	type?: AuctionType;
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
	options: IGetPaginatedAuctionsOptions,
) => Promise<OffsetPaginatedData<IAuctionData>>;
export const getPaginatedAuctions: IFunctionSignature = cache(
	async ({
		page,
		perPage,
		sortBy,
		sortDirection,
		ownerId,
		type,
		isPending,
		isLive,
		hasEnded,
	}) => {
		const cookieHeaders = await getSession();
		if (!cookieHeaders) return getDefaultData('You must be logged in to access this resource.');
		const querySettings: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Cookie: cookieHeaders,
			},
		};

		const queryUrl = new URL('/v1/auctions/', process.env.NEXT_PUBLIC_BACKEND_URL);
		if (page) queryUrl.searchParams.append('page', page.toString());
		if (perPage) queryUrl.searchParams.append('perPage', perPage.toString());
		if (sortBy) queryUrl.searchParams.append('orderBy', sortBy);
		if (sortDirection) queryUrl.searchParams.append('orderDir', sortDirection);
		if (ownerId) queryUrl.searchParams.append('owner', ownerId);
		if (type) queryUrl.searchParams.append('type', type);
		if (isPending) queryUrl.searchParams.append('isPending', isPending.valueOf().toString());
		if (isLive) queryUrl.searchParams.append('isLive', isLive.valueOf().toString());
		if (hasEnded) queryUrl.searchParams.append('hasEnded', hasEnded.valueOf().toString());

		const response = await fetch(queryUrl, querySettings);
		const rawData = (await response.json()) as OffsetPaginatedData<unknown>;

		//	If theres an issue, return the default data with errors
		if (!rawData) return getDefaultData('No data was returned.');
		if (rawData.detail) return getDefaultData(rawData.detail ?? '');
		if (rawData.errors) return getDefaultData(...rawData.errors);

		//	Parse results using schema and collect issues
		const errors: Array<string> = [];
		const results = rawData.results.reduce<Array<IAuctionData>>((acc, result) => {
			try {
				// const parseResults = parse(ReadAuctionDataSchema, result);
				acc.push(result);
				// if (!parseResults.success) {
				// 	console.error(...parseResults.issues);
				// 	errors.push(...parseResults.issues.map((issue) => issue.message));
				// } else {
				// 	acc.push(parseResults.output);
				// }
			} catch (error) {
				errors.push('An error occurred while parsing the data.');
			}

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
export const preloadPaginatedAuctions: IFunctionSignature = async (options) => {
	void getPaginatedAuctions(options);
};
