'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { B2FRoleMap, DefaultAuctionCycleData, IAuctionCycleData } from '@/schema/models';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<IAuctionCycleData> = (
	...errors
) => ({
	ok: false,
	errors: errors,
	...DefaultAuctionCycleData,
});

type IFunctionSignature = (uuid: string) => Promise<ServerData<IAuctionCycleData>>;
export const getSingleCycle: IFunctionSignature = cache(async (uuid) => {
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

	const queryUrl = new URL(`/v1/cycles/${uuid}`, process.env.NEXT_PUBLIC_BACKEND_URL);

	const response = await fetch(queryUrl, querySettings);
	const rawData = camelCase(await response.json(), 5) as ServerData<IAuctionCycleData>;

	//	If theres an issue, return the default data with errors
	if (!rawData) return getDefaultData(t('lib.noData'));
	if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	//	Map roles from backend names to frontend names
	const mappedResult = {
		...rawData,
		adminAssignments: rawData.adminAssignments.map((admin) => {
			return {
				...admin,
				role: B2FRoleMap[admin.role] || admin.role,
			};
		}),
	};

	//	TODO: Validate the data using schema
	return {
		...mappedResult,
		ok: true,
	} as ServerData<IAuctionCycleData>;
});

//	@ts-expect-error - Preload doesn't return anything but signature requires a return
export const preloadSingleCycle: IFunctionSignature = async (options) => {
	void getSingleCycle(options);
};
