import localFont from 'next/font/local';

export const SourceSansPro = localFont({
	src: [
		{
			path: '../../../public/fonts/sourcesanspro-regular.woff2',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../../../public/fonts/sourcesanspro-semibold.woff2',
			weight: '600',
			style: 'normal',
		},
		{
			path: '../../../public/fonts/sourcesanspro-bold.woff2',
			weight: '700',
			style: 'normal',
		},
	],
});

export const SourceSerifPro = localFont({
	src: [
		{
			path: '../../../public/fonts/sourceserifpro-regular.woff2',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../../../public/fonts/sourceserifpro-semibold.woff2',
			weight: '600',
			style: 'normal',
		},
		{
			path: '../../../public/fonts/sourceserifpro-bold.woff2',
			weight: '700',
			style: 'normal',
		},
		{
			path: '../../../public/fonts/sourceserifpro-black.woff2',
			weight: '900',
			style: 'normal',
		},
	],
});
