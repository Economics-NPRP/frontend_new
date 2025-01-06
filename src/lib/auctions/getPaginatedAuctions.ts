import { camelCase } from 'change-case/keys';
import { cache } from 'react';
import 'server-only';
import { safeParse } from 'valibot';

import { getSession } from '@/lib/auth';
import { AuctionType, IAuctionData, ReadAuctionDataSchema } from '@/schema/models';
import { IOffsetPagination, OffsetPaginatedData, SortDirection } from '@/types';

interface IFunctionOptions extends IOffsetPagination {
	sortBy?: string;
	sortDirection?: SortDirection;

	ownerId?: string;
	type?: AuctionType;
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

type IFunctionSignature = (options: IFunctionOptions) => Promise<OffsetPaginatedData<IAuctionData>>;
export const getPaginatedAuctions: IFunctionSignature = cache(
	async ({ page, perPage, sortBy, sortDirection }) => {
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
		if (perPage) queryUrl.searchParams.append('per_page', perPage.toString());
		if (sortBy) queryUrl.searchParams.append('order_by', sortBy);
		if (sortDirection) queryUrl.searchParams.append('order_dir', sortDirection);

		const response = await fetch(queryUrl, querySettings);
		const rawData = camelCase(await response.json(), 5) as OffsetPaginatedData<unknown>; //	TODO: remove camelCase when backend is fixed
		console.log(rawData);

		//	Parse results using schema and collect issues
		const errors: Array<string> = rawData.errors || [];
		const results = rawData.results.reduce<Array<IAuctionData>>((acc, result) => {
			const parseResults = safeParse(ReadAuctionDataSchema, result);
			if (!parseResults.success) {
				console.error(...parseResults.issues);
				errors.push(...parseResults.issues.map((issue) => issue.message));
			} else {
				acc.push(parseResults.output);
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
export const preloadPaginatedAuctions: IFunctionSignature = (options) => {
	void getPaginatedAuctions(options);
};
