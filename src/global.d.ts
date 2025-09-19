import 'react';

import en from '@/locales/en.json';

type Messages = typeof en;

declare global {
	interface IntlMessages extends Messages {}
	namespace NodeJS {
		interface ProcessEnv {
			COOKIE_DOMAIN?: string;
			DOMAIN?: string;
			NEXT_PUBLIC_BACKEND_URL?: string;
			SUPERUSER_EMAIL?: string;
			SUPERUSER_PASSWORD?: string;
		}
	}
}

declare module 'react' {
	interface CSSProperties {
		[key: `--${string}`]: string | number;
	}
}
