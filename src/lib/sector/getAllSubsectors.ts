'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { ISectorData } from '@/schema/models';
import { ArrayServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ArrayServerData<ISectorData> = (...errors) => ({
	ok: false,
	errors: errors,
	results: [],
	resultCount: 0,
});

type IFunctionSignature = () => Promise<ArrayServerData<ISectorData>>;
export const getAllSubsectors: IFunctionSignature = cache(async () => {
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

	const queryUrl = new URL(`/v1/sectors`, process.env.NEXT_PUBLIC_BACKEND_URL);

	const response = await fetch(queryUrl, querySettings);
	const rawData = camelCase(await response.json(), 5) as ArrayServerData<unknown>;

	//	If theres an issue, return the default data with errors
	if (!rawData) return getDefaultData(t('lib.noData'));
	if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);
	if (!Array.isArray(rawData)) return getDefaultData(t('lib.dataFormatError'));

	//	Parse results using schema and collect issues
	const errors: Array<string> = [];
	const results = rawData.reduce<Array<ISectorData>>((acc, result) => {
		acc.push(result);
		return acc;
	}, []);

	return {
		ok: errors.length === 0,
		results,
		resultCount: results.length,
		errors,
	} as ArrayServerData<ISectorData>;
});

//	@ts-expect-error - Preload doesn't return anything but signature requires a return
export const preloadAllSubsectors: IFunctionSignature = async () => {
	void getAllSubsectors();
};
