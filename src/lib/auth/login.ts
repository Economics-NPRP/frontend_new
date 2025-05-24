'use server';

import { camelCase } from 'change-case/keys';
import 'server-only';

import { ILoginData } from '@/schema/models';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<{}> = (...errors) => ({
	ok: false,
	errors: errors,
});

type IFunctionSignature = (options: ILoginData) => Promise<ServerData<{}>>;
export const login: IFunctionSignature = async ({ email, password }) => {
	const loginData = new FormData();
	loginData.append('username', email);
	loginData.append('password', password);

	const querySettings: RequestInit = {
		method: 'POST',
		body: loginData,
	};

	const queryUrl = new URL('/v1/auth/oauth2', process.env.NEXT_PUBLIC_BACKEND_URL);

	const response = await fetch(queryUrl, querySettings);
	const rawData = camelCase(await response.json(), 5) as ServerData<{}>;

	//	TODO: change this once the backend doesnt return null
	if (!rawData)
		return {
			ok: true,
		};

	//	If theres an issue, return the default data with errors
	if (rawData.detail) return getDefaultData(rawData.detail ?? '');
	if (rawData.errors) return getDefaultData(...rawData.errors);

	return {
		ok: true,
	};
};
