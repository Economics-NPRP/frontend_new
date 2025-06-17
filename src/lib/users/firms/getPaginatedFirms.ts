'use server';

import { camelCase } from 'change-case/keys';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { IUserData } from '@/schema/models';
import { IOffsetPagination, OffsetPaginatedData, SortDirection } from '@/types';

export interface IGetPaginatedFirmsOptions extends IOffsetPagination {
	sortBy?: string | null;
	sortDirection?: SortDirection | null;
}

const getDefaultData: (...errors: Array<string>) => OffsetPaginatedData<IUserData> = (
	...errors
) => ({
	ok: false,
	errors: errors,
	results: [] as Array<IUserData>,
	page: 1,
	pageCount: 1,
	totalCount: 0,
	perPage: 10,
	resultCount: 0,
});

type IFunctionSignature = (
	options: IGetPaginatedFirmsOptions,
) => Promise<OffsetPaginatedData<IUserData>>;
export const getPaginatedFirms: IFunctionSignature = cache(
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

		const queryUrl = new URL('/v1/users/firms', process.env.NEXT_PUBLIC_BACKEND_URL);
		if (page) queryUrl.searchParams.append('page', page.toString());
		if (perPage) queryUrl.searchParams.append('per_page', perPage.toString());
		if (sortBy) queryUrl.searchParams.append('order_by', sortBy);
		if (sortDirection) queryUrl.searchParams.append('order_dir', sortDirection);

		const response = await fetch(queryUrl, querySettings);
		const rawData = camelCase(await response.json(), 5) as OffsetPaginatedData<unknown>;

		//	If theres an issue, return the default data with errors
		if (!rawData) return getDefaultData('No data was returned.');
		if (rawData.detail) return getDefaultData(rawData.detail ?? '');
		if (rawData.errors) return getDefaultData(...rawData.errors);

		//	Parse results using schema and collect issues
		const errors: Array<string> = [];
		const results = rawData.results.reduce<Array<IUserData>>((acc, result) => {
			acc.push(result as IUserData);
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
export const preloadPaginatedFirms: IFunctionSignature = async (options) => {
	void getPaginatedFirms(options);
};
