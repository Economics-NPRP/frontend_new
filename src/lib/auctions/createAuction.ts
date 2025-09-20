'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { toSnakeCase } from '@/helpers';
import { DefaultAuctionData, IAuctionData, ICreateAuctionOutput } from '@/schema/models';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<IAuctionData> = (...errors) => ({
	ok: false,
	errors: errors,
	...DefaultAuctionData,
});

type IFunctionSignature = (data: ICreateAuctionOutput) => Promise<ServerData<IAuctionData>>;
export const createAuction: IFunctionSignature = cache(async (data) => {
	const t = await getTranslations();

	const cookieStore = await cookies();
	const access = cookieStore.get('ets_access_token')?.value;
	const refresh = cookieStore.get('ets_refresh_token')?.value;
	const cookieHeaders =
		access && refresh ? `ets_access_token=${access}; ets_refresh_token=${refresh}` : '';
	if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));
	const querySettings: RequestInit = {
		method: 'POST',
		body: JSON.stringify(toSnakeCase({ ...data, title: "some auction Title", description: "some auction Description" })),
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

	// const path = data.type === 'open' ? '/api/v1/auctions/o/' : '/api/v1/auctions/s/';
	const path = data.type === 'open' ? '/v1/auctions/o/' : '/v1/auctions/s/';
	const queryUrl = new URL(path, process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080');
	console.log("THIS DATA ->", JSON.stringify(toSnakeCase({ ...data, title: "some auction Title", description: "some auction Description" })))

	const response = await fetch(queryUrl, querySettings);
	console.log("THIS RESPONSE ->", response)
	const rawData = camelCase(await response.json(), 5) as ServerData<IAuctionData>;

	//	If theres an issue, return the default data with errors
	if (response.status === 403) return getDefaultData(t('lib.auth.adminError'));
	// if (response.status === 409) return getDefaultData(t('lib.auction.exists'));
	if (response.status === 422)
		return getDefaultData(t('lib.validationError'), JSON.stringify(rawData.detail) ?? '');
	if (!rawData) return getDefaultData(t('lib.noData'));
	if (rawData.detail) return getDefaultData(JSON.stringify(rawData.detail) ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	return {
		...rawData,
		ok: true,
	} as ServerData<IAuctionData>;
});
