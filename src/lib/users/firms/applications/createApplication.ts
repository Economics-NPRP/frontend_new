'use server';

import { camelCase, snakeCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import 'server-only';

import { DefaultFirmApplication, IFirmApplication } from '@/schema/models';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<IFirmApplication> = (...errors) => ({
	ok: false,
	errors: errors,
	...DefaultFirmApplication,
});

type IFunctionSignature = (data: IFirmApplication) => Promise<ServerData<IFirmApplication>>;
export const createApplication: IFunctionSignature = cache(async (data) => {
	const t = await getTranslations();

	const querySettings: RequestInit = {
		method: 'POST',
		body: JSON.stringify(snakeCase(data, 5)),
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const queryUrl = new URL('/v1/users/firms/applications/', process.env.NEXT_PUBLIC_BACKEND_URL);

	const response = await fetch(queryUrl, querySettings);
	const rawData = camelCase(await response.json(), 5) as ServerData<IFirmApplication>;

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
	} as ServerData<IFirmApplication>;
});
