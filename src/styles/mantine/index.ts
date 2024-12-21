import { DEFAULT_THEME, createTheme, mergeMantineTheme } from '@mantine/core';

import { components } from './components';
import { SourceSansPro, SourceSerifPro } from './fonts';
import { breakpoints, colors, shadows } from './theme';

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
