'use client';

import { Badge, type MantineThemeComponents, Title, Tooltip } from '@mantine/core';

export const components: MantineThemeComponents = {
	Badge: Badge.extend({
		defaultProps: {
			px: 8,
		},
	}),
	Title: Title.extend({
		classNames: (theme, props) => {
			return { root: `heading-${props.order}` };
		},
	}),
	Tooltip: Tooltip.extend({
		defaultProps: {
			openDelay: 500,
			position: 'top',
			withArrow: true,
		},
	}),
};
