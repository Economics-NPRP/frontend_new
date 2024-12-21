import { Avatar, type MantineColorScheme } from '@mantine/core';
import { IconAccessible, IconBell, IconLanguage, IconMoon, IconSearch, IconSun } from '@tabler/icons-react';

export type HeaderButtonVariantType =
	| 'logo'
	| 'search'
	| 'notifications'
	| 'accessibility'
	| 'theme'
	| 'language'
	| 'user';

export interface HeaderButtonData {
	tooltip: string | ((args: never) => string);
	ariaLabel: string | ((args: never) => string);
	icon: JSX.Element | ((args: never) => JSX.Element);
}

export const HeaderButtonVariants: Partial<Record<HeaderButtonVariantType, HeaderButtonData>> = {
	search: {
		tooltip: `Search for an auction`,
		ariaLabel: `Search for an auction`,
		icon: <IconSearch size={16} />,
	},
	notifications: {
		tooltip: `Notifications`,
		ariaLabel: `Notifications`,
		icon: <IconBell size={16} />,
	},
	accessibility: {
		tooltip: `Accessibility options`,
		ariaLabel: `Accessibility options`,
		icon: <IconAccessible size={16} />,
	},
	language: {
		tooltip: (language: string) => `Switch to Arabic`,
		ariaLabel: (language: string) => `Switch to Arabic`,
		icon: <IconLanguage size={16} />,
	},
	theme: {
		tooltip: (theme: MantineColorScheme) => `Switch to ${theme} theme`,
		ariaLabel: (theme: MantineColorScheme) => `Switch to ${theme} theme`,
		icon: (theme: MantineColorScheme) => (theme === 'light' ? <IconSun size={16} /> : <IconMoon size={16} />),
	},
	user: {
		tooltip: `My Account`,
		ariaLabel: `My Account`,
		icon: <Avatar name="John Doe" color="initials" />,
	},
};

export const DynamicVariants: Array<HeaderButtonVariantType> = ['language', 'theme'];
