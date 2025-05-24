import { jwtDecode } from 'jwt-decode';

type IFunctionSignature = (
	response: Response,
	handler: (key: string, value: string, exp: number) => void,
) => Array<{ key: string; value: string; exp: number }>;
export const extractCookies: IFunctionSignature = (response, handler) => {
	const cookieList = response.headers.getSetCookie();
	return cookieList.map((cookie) => {
		const [key, value] = cookie.split('; ')[0].split('=');

		//	Special case for empty cookies to reset them and clear the value
		if (!value || value === '""') {
			handler(key, '', Date.now());
			return { key, value: '', exp: Date.now() };
		}

		const { exp } = jwtDecode(value);
		handler(key, value, exp ? exp * 1000 : Date.now());
		return { key, value, exp: exp ? exp * 1000 : Date.now() };
	});
};

export const getCookie = (key: string): string | undefined => {
	//	Make sure this code runs only in the browser
	if (typeof document === 'undefined') return undefined;

	const cookies = document.cookie.split('; ').reduce(
		(acc, cookie) => {
			const [cookieKey, cookieValue] = cookie.split('=');
			acc[cookieKey] = decodeURIComponent(cookieValue);
			return acc;
		},
		{} as Record<string, string>,
	);
	return cookies[key];
};
