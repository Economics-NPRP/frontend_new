'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl } from '@/helpers';
import { AuctionCycleStatus, B2FRoleMap, IAuctionCycleData } from '@/schema/models';
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
		console.log(status);

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
		if (page) params.append('page', page.toString());
		if (perPage) params.append('per_page', perPage.toString());
		if (sortBy) params.append('order_by', sortBy ?? '');
		if (sortDirection) params.append('order_dir', sortDirection);
		if (status) params.append('status', status);

		const response = await fetch(
			await internalUrl(
				`/api/proxy/v1/cycles/${params.toString() ? `?${params.toString()}` : ''}`,
			),
			querySettings,
		);
		const rawData = camelCase(
			await response.json(),
			5,
		) as OffsetPaginatedData<IAuctionCycleData>;

		//	If theres an issue, return the default data with errors
		if (!rawData) return getDefaultData(t('lib.noData'));
		if (rawData.detail) return getDefaultData(rawData.detail ?? '');
		if (rawData.errors) return getDefaultData(...rawData.errors);

		//	Parse results using schema and collect issues
		const errors: Array<string> = [];
		const results = rawData.results.reduce<Array<IAuctionCycleData>>((acc, result) => {
			//	Map roles from backend names to frontend names
			const mappedResult = {
				...result,
				adminAssignments: result.adminAssignments.map((admin) => {
					return {
						...admin,
						role: B2FRoleMap[admin.role] || admin.role,
					};
				}),
			};

			acc.push(mappedResult);
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
