'use server';

import { camelCase, snakeCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl } from '@/helpers';
import { DefaultSubsectorData, ICreateSubsector, ISubsectorData } from '@/schema/models';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<ISubsectorData> = (...errors) => ({
	ok: false,
	errors: errors,
	...DefaultSubsectorData,
});

type IFunctionSignature = (
	data: ICreateSubsector,
	subsectorId?: string | null,
) => Promise<ServerData<ISubsectorData>>;
export const createSubsector: IFunctionSignature = cache(async (data, subsectorId) => {
	const t = await getTranslations();

	const cookieStore = await cookies();
	const access = cookieStore.get('ets_access_token')?.value;
	const refresh = cookieStore.get('ets_refresh_token')?.value;
	const cookieHeaders =
		access && refresh ? `ets_access_token=${access}; ets_refresh_token=${refresh}` : '';
	if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));

	const querySettings: RequestInit = {
		method: subsectorId ? 'PUT' : 'POST',
		body: JSON.stringify(snakeCase(data, 5)),
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

	const path = subsectorId
		? `/api/proxy/v1/subsectors/${subsectorId}`
		: '/api/proxy/v1/subsectors/';
	const response = await fetch(await internalUrl(path), querySettings);
	const rawData = camelCase(await response.json(), 5) as ServerData<ISubsectorData>;

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
	} as ServerData<ISubsectorData>;
});
