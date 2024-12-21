import { createTheme, DEFAULT_THEME, mergeMantineTheme } from '@mantine/core';
import { breakpoints, colors, shadows } from './theme';
import { SourceSansPro, SourceSerifPro } from './fonts';
import { components } from './components';

export const theme = mergeMantineTheme(
	DEFAULT_THEME,
	createTheme({
		fontFamily: SourceSansPro.style.fontFamily,
		headings: { fontFamily: SourceSerifPro.style.fontFamily },
		defaultRadius: 0,
		primaryColor: 'dark',
		primaryShade: 6,

		breakpoints,
		colors,
		components,
		shadows,
	}),
);

export { breakpoints, colors, SourceSansPro, SourceSerifPro };
