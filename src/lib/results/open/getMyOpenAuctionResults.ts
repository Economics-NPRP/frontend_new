'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl } from '@/helpers';
import { DefaultMyAuctionResultsData, IMyAuctionResultsData, ServerData } from '@/types';

export interface IGetMyOpenAuctionResultsOptions {
	auctionId: string;
}

const getDefaultData: (...errors: Array<string>) => ServerData<IMyAuctionResultsData> = (
	...errors
) => ({
	...DefaultMyAuctionResultsData,
	ok: false,
	errors: errors,
});

type IFunctionSignature = (auctionId: string) => Promise<ServerData<IMyAuctionResultsData>>;
export const getMyOpenAuctionResults: IFunctionSignature = cache(async (auctionId) => {
	const t = await getTranslations();

	const cookieStore = await cookies();
	const access = cookieStore.get('ets_access_token')?.value;
	const refresh = cookieStore.get('ets_refresh_token')?.value;
	const cookieHeaders =
		access && refresh ? `ets_access_token=${access}; ets_refresh_token=${refresh}` : '';
	if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));
	const querySettings: RequestInit = {
		method: 'GET',
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
		await internalUrl(`/api/proxy/v1/results/o/me/?auction_id=${auctionId}`),
		querySettings,
	);
	const rawData = camelCase(await response.json(), 5) as ServerData<IMyAuctionResultsData>;

	//	If theres an issue, return the default data with errors
	if (!rawData) return getDefaultData(t('lib.noData'));
	if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	//	TODO: Validate the data using schema
	return {
		...rawData,
		ok: true,
	} as ServerData<IMyAuctionResultsData>;
});

//	@ts-expect-error - Preload doesn't return anything but signature requires a return
export const preloadMyOpenAuctionResults: IFunctionSignature = async (options) => {
	void getMyOpenAuctionResults(options);
};
