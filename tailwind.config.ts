import { addCustomUtilities } from './src/styles/plugins/addCustomUtilities';
import { breakpoints, colors, shadows } from './src/styles/mantine/theme';
import tailwindPresetMantine from 'tailwind-preset-mantine';
import type { Config } from 'tailwindcss';
import { resolve } from 'node:path';

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
	plugins: [addCustomUtilities(resolve(__dirname, './src/styles/typography.css'))],
};
export default config;
