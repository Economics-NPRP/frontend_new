'use client';

import { useTranslations } from 'next-intl';

import { Button, Center, Flex, Group, Text, Tooltip } from '@mantine/core';
import { IconArrowUpLeft, IconBox } from '@tabler/icons-react';

import { HeaderButton } from './HeaderButton';
import { SearchBar } from './SearchBar';
import classes from './styles.module.css';

export const Header = () => {
	const t = useTranslations();

	return (
		<Center component="header" className={classes.root}>
			<Group className={classes.container}>
				<Flex className={classes.left}>
					<Tooltip label={t('header.return-to-dashboard.tooltip')}>
						<Button
							component="a"
							href="/dashboard"
							aria-label={t('header.return-to-dashboard.aria')}
							className={classes.dashboardButton}
							variant="light"
							size="xs"
							leftSection={<IconArrowUpLeft size={14} />}
							visibleFrom="sm"
						>
							<Text visibleFrom="lg" inherit>
								{t('header.return-to-dashboard.long')}
							</Text>
							<Text hiddenFrom="lg" inherit>
								{t('header.return-to-dashboard.short')}
							</Text>
						</Button>
					</Tooltip>
					<Tooltip label={t('header.return-to-marketplace.tooltip')}>
						<Button
							component="a"
							href="/"
							aria-label={t('header.return-to-marketplace.aria')}
							classNames={{ root: `${classes.logo} ${classes.headerButton}`, label: classes.label }}
							variant="transparent"
							size="xs"
							leftSection={<IconBox size={20} />}
						>
							ETS
						</Button>
					</Tooltip>
					<HeaderButton variant="notifications" />
				</Flex>
				<SearchBar />
				<Flex className={classes.right}>
					<HeaderButton className={classes.search} variant="search" hiddenFrom="md" />
					<HeaderButton variant="accessibility" visibleFrom="xs" />
					<HeaderButton variant="language" visibleFrom="xs" />
					<HeaderButton variant="theme" visibleFrom="xs" />
					<HeaderButton className={classes.user} variant="user" />
				</Flex>
			</Group>
		</Center>
	);
};
