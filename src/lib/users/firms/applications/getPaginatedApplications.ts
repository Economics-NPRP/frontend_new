'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { FirmApplicationStatusFilter, IFirmApplication } from '@/schema/models';
import { IKeysetPagination, KeysetPaginatedData } from '@/types';

export interface IGetPaginatedApplicationsOptions extends IKeysetPagination {
	status?: FirmApplicationStatusFilter;
}

const getDefaultData: (...errors: Array<string>) => KeysetPaginatedData<IFirmApplication> = (
	...errors
) => ({
	ok: false,
	errors: errors,
	results: [] as Array<IFirmApplication>,
	perPage: 10,
	hasNext: false,
	hasPrev: false,
	cursorForNextPage: null,
	cursorForPrevPage: null,
	totalCount: 0,
	isExact: true,
	resultCount: 0,
});

type IFunctionSignature = (
	options: IGetPaginatedApplicationsOptions,
) => Promise<KeysetPaginatedData<IFirmApplication>>;
export const getPaginatedApplications: IFunctionSignature = cache(
	async ({ status, cursor, perPage, navDirection }) => {
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
			'/v1/users/firms/applications',
			process.env.NEXT_PUBLIC_BACKEND_URL,
		);
		if (status && status !== 'all') queryUrl.searchParams.append('status', status.toString());
		if (cursor) queryUrl.searchParams.append('cursor', cursor.toString());
		if (perPage) queryUrl.searchParams.append('per_page', perPage.toString());
		if (navDirection) {
			queryUrl.searchParams.append('nav_direction', navDirection.toString());
			queryUrl.searchParams.append(
				'order_direction',
				navDirection === 'next' ? 'asc' : 'desc',
			);
		}

		const response = await fetch(queryUrl, querySettings);
		const rawData = camelCase(await response.json(), 5) as KeysetPaginatedData<unknown>;

		//	If theres an issue, return the default data with errors
		if (response.status === 422)
			return getDefaultData(t('lib.validationError'), JSON.stringify(rawData.detail) ?? '');
		if (!rawData) return getDefaultData(t('lib.noData'));
		if (rawData.detail) return getDefaultData(rawData.detail ?? '');
		if (rawData.errors) return getDefaultData(...rawData.errors);

		//	Parse results using schema and collect issues
		const errors: Array<string> = [];
		const results = rawData.results.reduce<Array<IFirmApplication>>((acc, result) => {
			acc.push(result as IFirmApplication);
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
export const preloadPaginatedApplications: IFunctionSignature = async (options) => {
	void getPaginatedApplications(options);
};
