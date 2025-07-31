import { Locale } from '@/locales';
import { DefaultUserData, IReadUser } from '@/schema/models';
import { Avatar, type MantineColorScheme } from '@mantine/core';
import {
	IconAccessible,
	IconBell,
	IconBuildingStore,
	IconLanguage,
	IconMoon,
	IconSearch,
	IconSun,
} from '@tabler/icons-react';

export type HeaderButtonVariantType =
	| 'search'
	| 'notifications'
	| 'accessibility'
	| 'theme'
	| 'language'
	| 'user'
	| 'marketplace';

export interface HeaderButtonData {
	tooltip: string | ((args: never) => string);
	ariaLabel: string | ((args: never) => string);
	icon: JSX.Element | ((args: never) => JSX.Element);
}

export const HeaderButtonVariants: Record<HeaderButtonVariantType, HeaderButtonData> = {
	search: {
		tooltip: 'components.header.buttons.search.tooltip',
		ariaLabel: 'components.header.buttons.search.aria',
		icon: <IconSearch size={16} />,
	},
	notifications: {
		tooltip: 'components.header.buttons.notifications.tooltip',
		ariaLabel: 'components.header.buttons.notifications.aria',
		icon: <IconBell size={16} />,
	},
	accessibility: {
		tooltip: 'components.header.buttons.accessibility.tooltip',
		ariaLabel: 'components.header.buttons.accessibility.aria',
		icon: <IconAccessible size={16} />,
	},
	language: {
		tooltip: (language: Locale) => `components.header.buttons.language.${language}.tooltip`,
		ariaLabel: (language: Locale) => `components.header.buttons.language.${language}.aria`,
		icon: <IconLanguage size={16} />,
	},
	theme: {
		tooltip: (theme: MantineColorScheme) => `components.header.buttons.theme.${theme}.tooltip`,
		ariaLabel: (theme: MantineColorScheme) => `components.header.buttons.theme.${theme}.aria`,
		icon: (theme: MantineColorScheme) =>
			theme === 'light' ? <IconSun size={16} /> : <IconMoon size={16} />,
	},
	user: {
		tooltip: () => `components.header.buttons.user.tooltip`,
		ariaLabel: () => `components.header.buttons.user.aria`,
		icon: (currentUser: IReadUser) => (
			<Avatar name={(currentUser || DefaultUserData).name} color="initials" />
		),
	},
	marketplace: {
		tooltip: 'components.header.buttons.marketplace.tooltip',
		ariaLabel: 'components.header.buttons.marketplace.aria',
		icon: <IconBuildingStore size={16} />,
	},
};

export const DynamicVariants: Array<HeaderButtonVariantType> = ['language', 'theme', 'user'];
