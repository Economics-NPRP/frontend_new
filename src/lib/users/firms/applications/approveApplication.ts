'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { OffsetPaginatedData, ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<{}> = (...errors) => ({
	ok: false,
	errors: errors,
});

type IFunctionSignature = (applicationId: string) => Promise<ServerData<{}>>;
export const approveApplication: IFunctionSignature = cache(async (applicationId) => {
	const t = await getTranslations();

	const cookieHeaders = await getSession();
	if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));
	const querySettings: RequestInit = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookieHeaders,
		},
	};

	const queryUrl = new URL(
		`/v1/users/firms/applications/${applicationId}/approve`,
		process.env.NEXT_PUBLIC_BACKEND_URL,
	);

	const response = await fetch(queryUrl, querySettings);
	const rawData = camelCase(await response.json(), 5) as OffsetPaginatedData<unknown>;

	//	If theres an issue, return the default data with errors
	if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	return {
		ok: true,
	};
});
