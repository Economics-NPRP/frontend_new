import { ServerData } from '@/types';

export const throwError = async <T>(serverData: Promise<ServerData<T>>): Promise<ServerData<T>> => {
	const data = await serverData;
	if (!data.ok) {
		console.error(data);
		throw new Error(JSON.stringify(data));
	}
	return data;
};
