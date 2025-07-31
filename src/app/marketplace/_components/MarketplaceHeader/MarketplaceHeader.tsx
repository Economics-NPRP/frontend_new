'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { MyProfileMenu } from '@/components/MyProfileMenu';
import { Button, Center, Flex, Group, Text, Tooltip } from '@mantine/core';
import { IconArrowUpLeft, IconBox } from '@tabler/icons-react';

import { HeaderButton } from './HeaderButton';
import { SearchBar } from './SearchBar';
import classes from './styles.module.css';

export const MarketplaceHeader = () => {
	const t = useTranslations();

	return (
		<Center component="header" className={classes.root}>
			<Group className={classes.container}>
				<Flex className={classes.left}>
					<Tooltip label={t('constants.return.dashboard.tooltip')}>
						<Button
							component={Link}
							href="/dashboard"
							aria-label={t('constants.return.dashboard.aria')}
							className={classes.dashboardButton}
							variant="light"
							size="xs"
							leftSection={<IconArrowUpLeft size={14} />}
							visibleFrom="sm"
						>
							<Text visibleFrom="lg" inherit>
								{t('constants.return.dashboard.label')}
							</Text>
							<Text hiddenFrom="lg" inherit>
								{t('constants.return.dashboard.short')}
							</Text>
						</Button>
					</Tooltip>
					<Tooltip label={t('constants.return.marketplace.tooltip')}>
						<Button
							component={Link}
							href="/"
							aria-label={t('constants.return.marketplace.aria')}
							classNames={{
								root: `${classes.logo} ${classes.headerButton}`,
								label: classes.label,
							}}
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
					<MyProfileMenu>
						<HeaderButton
							className={`${classes.user} ${classes.button}`}
							variant="user"
						/>
					</MyProfileMenu>
				</Flex>
			</Group>
		</Center>
	);
};
