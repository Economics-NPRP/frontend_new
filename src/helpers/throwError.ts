import { ServerData } from '@/types';

export const throwError = async (serverData: Promise<ServerData<{}>>) => {
	const data = await serverData;
	if (!data.ok) {
		console.error(data);
		throw new Error(data.errors?.join(' ') ?? data.detail ?? 'An unknown error occurred.');
	}
	return data;
};
