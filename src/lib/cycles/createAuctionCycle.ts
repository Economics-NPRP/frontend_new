'use server';

import { camelCase, snakeCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import {
	AdminRole,
	DefaultAuctionCycleData,
	F2BRoleMap,
	IAuctionCycleData,
	ICreateAuctionCycleOutput,
	ICreateCycleAdmin,
} from '@/schema/models';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<IAuctionCycleData> = (
	...errors
) => ({
	ok: false,
	errors: errors,
	...DefaultAuctionCycleData,
});

type IFunctionSignature = (
	data: ICreateAuctionCycleOutput,
) => Promise<ServerData<IAuctionCycleData>>;
export const createAuctionCycle: IFunctionSignature = cache(async (data) => {
	const t = await getTranslations();

	const cookieHeaders = await getSession();
	if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));

	data.adminAssignments = data.adminAssignments.map((admin) => {
		const snakeCaseData = snakeCase(admin, 5) as ICreateCycleAdmin;
		snakeCaseData.role = F2BRoleMap[admin.role] as AdminRole;
		return snakeCaseData;
	});

	const payload = snakeCase(data, 5);
	console.log(payload);
	const querySettings: RequestInit = {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookieHeaders,
		},
	};

	const queryUrl = new URL('/v1/cycles/', process.env.NEXT_PUBLIC_BACKEND_URL);

	const response = await fetch(queryUrl, querySettings);
	const rawData = camelCase(await response.json(), 5) as ServerData<IAuctionCycleData>;

	//	If theres an issue, return the default data with errors
	if (response.status === 403) return getDefaultData(t('lib.auth.adminError'));
	if (response.status === 409) return getDefaultData(t('lib.cycles.exists'));
	if (response.status === 422)
		return getDefaultData(t('lib.validationError'), JSON.stringify(rawData.detail) ?? '');
	if (!rawData) return getDefaultData(t('lib.noData'));
	if (rawData.detail) return getDefaultData(JSON.stringify(rawData.detail) ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	return {
		...rawData,
		ok: true,
	} as ServerData<IAuctionCycleData>;
});
