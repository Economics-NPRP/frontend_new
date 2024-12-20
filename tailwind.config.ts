import { breakpoints, colors, shadows } from './src/styles/mantine/theme';
import tailwindPresetMantine from 'tailwind-preset-mantine';
import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	presets: [
		tailwindPresetMantine({
			mantineBreakpoints: breakpoints,
			mantineColors: colors,
		}),
	],
	theme: {
		boxShadow: shadows as Record<string, string>,
		extend: {
			fontFamily: {
				serif: ['SourceSerifPro', 'SourceSerifPro Fallback'],
				sans: ['SourceSansPro', 'SourceSansPro Fallback'],
			},
		},
	},
	corePlugins: {
		preflight: false,
	},
	plugins: [
		//	@ts-expect-error - Not working for some reason
		({ addUtilities }) => {
			addUtilities({
				'.heading-1': {},
				'.heading-2': {},
				'.heading-3': {},
				'.heading-4': {},
				'.heading-5': {},

				'.display-m': {},
				'.display-s': {},
				'.display-xs': {},

				'.paragraph-m': {},
				'.paragraph-s': {},
				'.paragraph-xs': {},

				'.numeric-xl': {},
				'.numeric-l': {},
				'.numeric-m': {},
			});
		},
	],
};
export default config;
