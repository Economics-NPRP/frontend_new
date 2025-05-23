import {
	DEFAULT_THEME,
	type MantineBreakpointsValues,
	MantineColorsTuple,
	MantineShadowsValues,
} from '@mantine/core';

export const breakpoints: MantineBreakpointsValues = {
	...DEFAULT_THEME.breakpoints,
	'3xl': '1920px',
};

export const shadows: Partial<MantineShadowsValues> = {
	lg: '6px 6px 0px 0px var(--shadow-color-1)',
	md: '4px 4px 0px 0px var(--shadow-color-1)',
	sm: '3px 3px 0px 0px var(--shadow-color-2)',
};

export const colors = {
	...DEFAULT_THEME.colors,

	dark: [
		'#c1c2c5',
		'#a6a7ab',
		'#909296',
		'#5c5f66',
		'#373a40',
		'#2c2e33',
		'#25262b',
		'#1a1b1e',
		'#141517',
		'#101113',
	] as MantineColorsTuple,

	maroon: [
		'#f3e8eb',
		'#dcb9c3',
		'#c58a9c',
		'#ad5b74',
		'#a14460',
		'#962c4c',
		'#8a1538',
		'#7c1332',
		'#6e112d',
		'#610f27',
		'#530d22',
	] as MantineColorsTuple,

	//  TODO: add actual shades
	skyline: [
		'#0d4261',
		'#0d4261',
		'#0d4261',
		'#0d4261',
		'#0d4261',
		'#0d4261',
		'#0d4261',
		'#0d4261',
		'#0d4261',
		'#0d4261',
		'#0d4261',
	] as MantineColorsTuple,

	palm: [
		'#129b82',
		'#129b82',
		'#129b82',
		'#129b82',
		'#129b82',
		'#129b82',
		'#129b82',
		'#129b82',
		'#129b82',
		'#129b82',
		'#129b82',
	] as MantineColorsTuple,

	salmon: [
		'#dd7877',
		'#dd7877',
		'#dd7877',
		'#dd7877',
		'#dd7877',
		'#dd7877',
		'#dd7877',
		'#dd7877',
		'#dd7877',
		'#dd7877',
		'#dd7877',
	] as MantineColorsTuple,

	purple: [
		'#8067a4',
		'#8067a4',
		'#8067a4',
		'#8067a4',
		'#8067a4',
		'#8067a4',
		'#8067a4',
		'#8067a4',
		'#8067a4',
		'#8067a4',
		'#8067a4',
	] as MantineColorsTuple,
};
