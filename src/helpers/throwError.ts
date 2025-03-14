import { ServerData } from '@/types';

//	Any is used to allow for any type of return data
//	eslint-disable-next-line
export const throwError = async (serverData: Promise<ServerData<any>>) => {
	const data = await serverData;
	if (!data.ok)
		throw new Error(data.errors?.join(' ') ?? data.detail ?? 'An unknown error occurred.');
	return data;
};
