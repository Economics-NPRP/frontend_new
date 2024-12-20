'use client';

import { Title, type MantineThemeComponents } from '@mantine/core';

export const components: MantineThemeComponents = {
	Title: Title.extend({
		classNames: (theme, props) => {
			return { root: `heading-${props.order}` };
		},
	}),
};
