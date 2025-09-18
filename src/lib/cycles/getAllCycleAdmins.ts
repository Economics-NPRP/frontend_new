'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl } from '@/helpers';
import { B2FRoleMap, ICycleAdminData } from '@/schema/models';
import { ArrayServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ArrayServerData<ICycleAdminData> = (
	...errors
) => ({
	ok: false,
	errors: errors,
	results: [],
	resultCount: 0,
});

type IFunctionSignature = (uuid: string) => Promise<ArrayServerData<ICycleAdminData>>;
export const getAllCycleAdmins: IFunctionSignature = cache(async (uuid) => {
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

	const response = await fetch(
		await internalUrl(`/api/proxy/v1/cycles/${uuid}/admins`),
		querySettings,
	);
	const rawData = camelCase(await response.json(), 5) as ArrayServerData<unknown>;

	//	If theres an issue, return the default data with errors
	if (!rawData) return getDefaultData(t('lib.noData'));
	if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);
	if (!Array.isArray(rawData)) return getDefaultData(t('lib.dataFormatError'));

	//	Parse results using schema and collect issues
	const errors: Array<string> = [];
	const results = rawData.reduce<Array<ICycleAdminData>>((acc, result) => {
		//	Map roles from backend names to frontend names
		const mappedResult = {
			...result,
			role: B2FRoleMap[result.role] || result.role,
		};

		acc.push(mappedResult);
		return acc;
	}, []);

	return {
		ok: errors.length === 0,
		results,
		resultCount: results.length,
		errors,
	} as ArrayServerData<ICycleAdminData>;
});

//	@ts-expect-error - Preload doesn't return anything but signature requires a return
export const preloadAllCycleAdmins: IFunctionSignature = async (options) => {
	void getAllCycleAdmins(options);
};
