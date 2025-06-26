'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { DefaultFirmData, IFirmData } from '@/schema/models';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<IFirmData> = (...errors) => ({
	ok: false,
	errors: errors,
	...DefaultFirmData,
});

type IFunctionSignature = (uuid: string) => Promise<ServerData<IFirmData>>;
export const getSingleFirm: IFunctionSignature = cache(async (uuid) => {
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
		`/v1/users/firms/${uuid}/profile`,
		process.env.NEXT_PUBLIC_BACKEND_URL,
	);

	const response = await fetch(queryUrl, querySettings);
	const rawData = camelCase(await response.json(), 5) as ServerData<unknown>;

	//	If theres an issue, return the default data with errors
	if (!rawData) return getDefaultData(t('lib.noData'));
	if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	//	TODO: Validate the data using schema
	return {
		...rawData,
		ok: true,
	} as ServerData<IFirmData>;
});

//	@ts-expect-error - Preload doesn't return anything but signature requires a return
export const preloadSingleFirm: IFunctionSignature = async (options) => {
	void getSingleFirm(options);
};
