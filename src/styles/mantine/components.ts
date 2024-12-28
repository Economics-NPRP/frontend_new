'use client';

import { Anchor, type MantineThemeComponents, Title, Tooltip } from '@mantine/core';

export const components: MantineThemeComponents = {
	Title: Title.extend({
		classNames: (theme, props) => {
			return { root: `heading-${props.order}` };
		},
	}),
	Tooltip: Tooltip.extend({
		defaultProps: {
			openDelay: 500,
			position: 'bottom',
		},
	}),
};
