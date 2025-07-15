'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useContext } from 'react';

import { toggleUserLocale } from '@/locales';
import { DashboardSidebarContext } from '@/pages/dashboard/_components/DashboardSidebar';
import { ActionIcon, Divider, Group, Tooltip, useMantineColorScheme } from '@mantine/core';
import {
	IconAccessible,
	IconChevronsLeft,
	IconChevronsRight,
	IconLanguage,
	IconMoon,
	IconSun,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export const Header = () => {
	const t = useTranslations();
	const locale = useLocale();
	const { colorScheme, setColorScheme } = useMantineColorScheme();
	const { expanded, setExpanded } = useContext(DashboardSidebarContext);

	return (
		<Group className={classes.header}>
			<Tooltip label={t(`components.header.buttons.theme.${colorScheme}.tooltip`)}>
				<ActionIcon
					className={classes.button}
					variant="subtle"
					onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
				>
					{colorScheme === 'light' ? <IconSun size={16} /> : <IconMoon size={16} />}
				</ActionIcon>
			</Tooltip>
			<Divider
				className={classes.divider}
				orientation={expanded ? 'vertical' : 'horizontal'}
			/>
			<Tooltip
				label={t(`components.header.buttons.language.${locale as 'en' | 'ar-QA'}.tooltip`)}
			>
				<ActionIcon className={classes.button} variant="subtle" onClick={toggleUserLocale}>
					<IconLanguage size={16} />
				</ActionIcon>
			</Tooltip>
			<Divider
				className={classes.divider}
				orientation={expanded ? 'vertical' : 'horizontal'}
			/>
			<Tooltip label={t('components.header.buttons.accessibility.tooltip')}>
				<ActionIcon className={classes.button} variant="subtle">
					<IconAccessible size={16} />
				</ActionIcon>
			</Tooltip>
			<Divider
				className={classes.divider}
				orientation={expanded ? 'vertical' : 'horizontal'}
			/>
			<Tooltip
				label={
					expanded
						? t('dashboard.sidebar.header.collapse')
						: t('dashboard.sidebar.header.expand')
				}
			>
				<ActionIcon
					className={classes.button}
					variant="subtle"
					onClick={() => setExpanded(!expanded)}
				>
					{expanded ? <IconChevronsLeft size={16} /> : <IconChevronsRight size={16} />}
				</ActionIcon>
			</Tooltip>
		</Group>
	);
};
