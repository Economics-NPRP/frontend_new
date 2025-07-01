import { ServerData } from '@/types';

export const throwError = async <T>(
	serverData: Promise<ServerData<T>>,
	key?: string,
): Promise<ServerData<T>> => {
	const data = await serverData;
	if (!data.ok) {
		console.error(
			`Error fetching for key: "${key || 'unknown'}", possible error: ${JSON.stringify(data.errors || ['Unknown error'])}`,
			data,
		);
		throw new Error(JSON.stringify(data));
	}
	return data;
};
