'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl, replaceRoleNames, toSnakeCase } from '@/helpers';
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
	cycleId?: string | null,
) => Promise<ServerData<IAuctionCycleData>>;
export const createAuctionCycle: IFunctionSignature = cache(async (data, cycleId) => {
	const t = await getTranslations();

	const cookieStore = await cookies();
	const access = cookieStore.get('ets_access_token')?.value;
	const refresh = cookieStore.get('ets_refresh_token')?.value;
	const cookieHeaders =
		access && refresh ? `ets_access_token=${access}; ets_refresh_token=${refresh}` : '';
	if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));

	// data.adminAssignments = data.adminAssignments.map((admin) => {
	// 	const snakeCaseData = snakeCase(admin, 5) as ICreateCycleAdmin;
	// 	snakeCaseData.role = F2BRoleMap[admin.role] as AdminRole;
	// 	return snakeCaseData;
	// });

	const payload = toSnakeCase(data);

	replaceRoleNames((payload as any)?.admin_assignments as { role: string; admin_id: string }[]);

	const querySettings: RequestInit = {
		method: cycleId ? 'PUT' : 'POST',
		body: JSON.stringify(payload),
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
		await internalUrl(cycleId ? `/api/proxy/v1/cycles/${cycleId}` : '/api/proxy/v1/cycles/'),
		querySettings,
	);
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
