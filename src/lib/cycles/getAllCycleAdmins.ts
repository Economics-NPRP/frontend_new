'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { AdminRole } from '@/schema/models/AdminRole';
import { ICycleAdminData } from '@/schema/models/CycleAdminData';
import { ArrayServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ArrayServerData<ICycleAdminData> = (
	...errors
) => ({
	ok: false,
	errors: errors,
	results: [],
	resultCount: 0,
});

const RoleMap: Record<string, AdminRole> = {
	planner: 'manager',
	coordinator: 'auctionOperator',
	permits_allocator: 'permitStrategist',
	permit_distributor: 'permitStrategist',
	payment_collector: 'financeOfficer',
};

type IFunctionSignature = (uuid: string) => Promise<ArrayServerData<ICycleAdminData>>;
export const getAllCycleAdmins: IFunctionSignature = cache(async (uuid) => {
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

	const queryUrl = new URL(`/v1/cycles/${uuid}/admins`, process.env.NEXT_PUBLIC_BACKEND_URL);

	const response = await fetch(queryUrl, querySettings);
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
			role: RoleMap[result.role] || result.role,
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
