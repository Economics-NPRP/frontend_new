'use server';

import { camelCase, snakeCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
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

	const cookieHeaders = await getSession();
	if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));

	const querySettings: RequestInit = {
		method: subsectorId ? 'PUT' : 'POST',
		body: JSON.stringify(snakeCase(data, 5)),
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookieHeaders,
		},
	};

	const queryUrl = new URL(
		subsectorId ? `/v1/subsectors/${subsectorId}` : '/v1/subsectors/',
		process.env.NEXT_PUBLIC_BACKEND_URL,
	);

	const response = await fetch(queryUrl, querySettings);
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
