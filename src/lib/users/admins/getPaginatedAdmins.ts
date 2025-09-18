'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl } from '@/helpers';
import { IAdminData } from '@/schema/models';
import { IOffsetPagination, OffsetPaginatedData, SortDirection } from '@/types';

export interface IGetPaginatedAdminsOptions extends IOffsetPagination {
	sortBy?: string | null;
	sortDirection?: SortDirection | null;

	isActive?: boolean;
	excludeIds?: Array<string>;
}

const getDefaultData: (...errors: Array<string>) => OffsetPaginatedData<IAdminData> = (
	...errors
) => ({
	ok: false,
	errors: errors,
	results: [] as Array<IAdminData>,
	page: 1,
	pageCount: 1,
	totalCount: 0,
	perPage: 10,
	resultCount: 0,
});

type IFunctionSignature = (
	options: IGetPaginatedAdminsOptions,
) => Promise<OffsetPaginatedData<IAdminData>>;
export const getPaginatedAdmins: IFunctionSignature = cache(
	async ({ isActive = true, excludeIds, page, perPage, sortBy, sortDirection }) => {
		const t = await getTranslations();

		// Build auth cookie header from incoming request cookies
		const cookieStore = await cookies();
		const access = cookieStore.get('ets_access_token')?.value;
		const refresh = cookieStore.get('ets_refresh_token')?.value;
		const cookieHeaders =
			access && refresh ? `ets_access_token=${access}; ets_refresh_token=${refresh}` : '';
		if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));
		const h = await headers();
		const xff = h.get('x-forwarded-for') || h.get('x-real-ip');
		const querySettings: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Cookie: cookieHeaders,
				...(xff ? { 'X-Forwarded-For': xff } : {}),
			},
		};

		// Use internal proxy for consistent cookie forwarding
		const params = new URLSearchParams();
		if (isActive) params.append('is_active', isActive.toString());
		if (page) params.append('page', page.toString());
		if (perPage) params.append('per_page', perPage.toString());
		if (sortBy) params.append('order_by', sortBy);
		if (sortDirection) params.append('order_dir', sortDirection);
		if (excludeIds) excludeIds.map((id) => params.append('exclude_ids', id));

		const queryUrl = `/api/proxy/v1/users/admins/${
			params.toString() ? `?${params.toString()}` : ''
		}`;

		const response = await fetch(await internalUrl(queryUrl), querySettings as RequestInit);
		const rawData = camelCase(await response.json(), 5) as OffsetPaginatedData<unknown>;

		//	If theres an issue, return the default data with errors
		if (!rawData) return getDefaultData(t('lib.noData'));
		if (rawData.detail) return getDefaultData(rawData.detail ?? '');
		if (rawData.errors) return getDefaultData(...rawData.errors);

		//	Parse results using schema and collect issues
		const errors: Array<string> = [];
		const results = rawData.results.reduce<Array<IAdminData>>((acc, result) => {
			acc.push(result as IAdminData);
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
export const preloadPaginatedAdmins: IFunctionSignature = async (options) => {
	void getPaginatedAdmins(options);
};
