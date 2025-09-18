'use server';

import { camelCase, snakeCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl } from '@/helpers';
import { DefaultCreateFirmApplication, ICreateFirmApplication } from '@/schema/models';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<ICreateFirmApplication> = (
	...errors
) => ({
	ok: false,
	errors: errors,
	...DefaultCreateFirmApplication,
});

type IFunctionSignature = (
	data: ICreateFirmApplication,
) => Promise<ServerData<ICreateFirmApplication>>;
export const createApplication: IFunctionSignature = cache(async (data) => {
	const t = await getTranslations();

	const cookieStore = await cookies();
	const access = cookieStore.get('ets_access_token')?.value;
	const refresh = cookieStore.get('ets_refresh_token')?.value;
	const cookieHeaders =
		access && refresh ? `ets_access_token=${access}; ets_refresh_token=${refresh}` : '';

	const querySettings: RequestInit = {
		method: 'POST',
		body: JSON.stringify(snakeCase(data, 5)),
		headers: {
			'Content-Type': 'application/json',
			...(cookieHeaders ? { Cookie: cookieHeaders } : {}),
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
		await internalUrl('/api/proxy/v1/users/firms/applications/'),
		querySettings,
	);
	const rawData = camelCase(await response.json(), 5) as ServerData<ICreateFirmApplication>;

	//	If theres an issue, return the default data with errors
	if (response.status === 409) return getDefaultData(t('lib.users.firms.applications.exists'));
	if (response.status === 422)
		return getDefaultData(t('lib.validationError'), JSON.stringify(rawData.detail) ?? '');
	if (!rawData) return getDefaultData(t('lib.noData'));
	if (rawData.detail) return getDefaultData(JSON.stringify(rawData.detail) ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	return {
		...rawData,
		ok: true,
	} as ServerData<ICreateFirmApplication>;
});
