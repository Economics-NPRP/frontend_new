import { Locale } from '@/locales';
import { Avatar, type MantineColorScheme } from '@mantine/core';
import { IconAccessible, IconBell, IconLanguage, IconMoon, IconSearch, IconSun } from '@tabler/icons-react';

export type HeaderButtonVariantType = 'search' | 'notifications' | 'accessibility' | 'theme' | 'language' | 'user';

export interface HeaderButtonData {
	tooltip: string | ((args: never) => string);
	ariaLabel: string | ((args: never) => string);
	icon: JSX.Element | ((args: never) => JSX.Element);
}

export const HeaderButtonVariants: Partial<Record<HeaderButtonVariantType, HeaderButtonData>> = {
	search: {
		tooltip: 'header.buttons.search-tooltip',
		ariaLabel: 'header.buttons.search-aria',
		icon: <IconSearch size={16} />,
	},
	notifications: {
		tooltip: 'header.buttons.notifications-tooltip',
		ariaLabel: 'header.buttons.notifications-aria',
		icon: <IconBell size={16} />,
	},
	accessibility: {
		tooltip: 'header.buttons.accessibility-tooltip',
		ariaLabel: 'header.buttons.accessibility-aria',
		icon: <IconAccessible size={16} />,
	},
	language: {
		tooltip: (language: Locale) => `header.buttons.language-${language}-tooltip`,
		ariaLabel: (language: Locale) => `header.buttons.language-${language}-aria`,
		icon: <IconLanguage size={16} />,
	},
	theme: {
		tooltip: (theme: MantineColorScheme) => `header.buttons.theme-${theme}-tooltip`,
		ariaLabel: (theme: MantineColorScheme) => `header.buttons.theme-${theme}-aria`,
		icon: (theme: MantineColorScheme) => (theme === 'light' ? <IconSun size={16} /> : <IconMoon size={16} />),
	},
	user: {
		tooltip: `header.buttons.user-tooltip`,
		ariaLabel: `header.buttons.user-aria`,
		icon: <Avatar name="John Doe" color="initials" />,
	},
};

export const DynamicVariants: Array<HeaderButtonVariantType> = ['language', 'theme'];
