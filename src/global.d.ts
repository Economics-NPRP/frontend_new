import 'react';

import en from '@/locales/en.json';

type Messages = typeof en;

declare global {
	interface IntlMessages extends Messages {}
}

declare module 'react' {
	interface CSSProperties {
		[key: `--${string}`]: string | number;
	}
}
