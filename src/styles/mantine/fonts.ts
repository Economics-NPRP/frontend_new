import localFont from 'next/font/local';

export const SourceSansPro = localFont({
	src: [
		{
			path: '../../../public/fonts/SourceSansPro-Regular.woff2',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../../../public/fonts/SourceSansPro-Semibold.woff2',
			weight: '600',
			style: 'normal',
		},
		{
			path: '../../../public/fonts/SourceSansPro-Bold.woff2',
			weight: '700',
			style: 'normal',
		},
	],
});

export const SourceSerifPro = localFont({
	src: [
		{
			path: '../../../public/fonts/SourceSerifPro-Regular.woff2',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../../../public/fonts/SourceSerifPro-Semibold.woff2',
			weight: '600',
			style: 'normal',
		},
		{
			path: '../../../public/fonts/SourceSerifPro-Bold.woff2',
			weight: '700',
			style: 'normal',
		},
		{
			path: '../../../public/fonts/SourceSerifPro-Black.woff2',
			weight: '900',
			style: 'normal',
		},
	],
});
