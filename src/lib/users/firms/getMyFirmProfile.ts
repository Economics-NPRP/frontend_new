'use server';

import { camelCase } from 'change-case/keys';
import { cache } from 'react';
import 'server-only';

import { getSession } from '@/lib/auth';
import { DefaultUserData, IUserData } from '@/schema/models';
import { IOffsetPagination, ServerData } from '@/types';

export interface IGetMyFirmProfileOptions extends IOffsetPagination {
	auctionId: string;
}

const getDefaultData: (...errors: Array<string>) => ServerData<IUserData> = (...errors) => ({
	ok: false,
	errors: errors,
	...DefaultUserData,
});

type IFunctionSignature = () => Promise<ServerData<IUserData>>;
export const getMyFirmProfile: IFunctionSignature = cache(async () => {
	const cookieHeaders = await getSession();
	if (!cookieHeaders) return getDefaultData('You must be logged in to access this resource.');
	const querySettings: RequestInit = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookieHeaders,
		},
	};

	const queryUrl = new URL('/v1/users/firms/profile', process.env.NEXT_PUBLIC_BACKEND_URL);

	const response = await fetch(queryUrl, querySettings);
	const rawData = camelCase(await response.json(), 5) as ServerData<unknown>;

	//	If theres an issue, return the default data with errors
	if (!rawData) return getDefaultData('No data was returned.');
	if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	//	TODO: Validate the data using schema
	return {
		...rawData,
		ok: true,
	} as ServerData<IUserData>;
});

//	@ts-expect-error - Preload doesn't return anything but signature requires a return
export const preloadMyFirmProfile: IFunctionSignature = async () => {
	void getMyFirmProfile();
};
