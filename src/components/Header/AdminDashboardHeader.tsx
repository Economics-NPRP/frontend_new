'use client';

import { useTranslations } from 'next-intl';

import { PageTabs } from '@/components/Header/PageTabs';
import { Button, Center, Flex, Group, Text, Tooltip } from '@mantine/core';
import { IconBox, IconBuildings, IconGavel, IconLayoutGrid, IconUsers } from '@tabler/icons-react';

import { HeaderButton } from './HeaderButton';
import { UserProfile } from './UserProfile';
import classes from './styles.module.css';

export const AdminDashboardHeader = () => {
	const t = useTranslations();

	return (
		<Center component="header" className={classes.root}>
			<Group className={classes.container}>
				<Flex className={classes.left}>
					<Tooltip label={t('constants.return.marketplace.tooltip')}>
						<Button
							component="a"
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
							ETS <Text className={classes.subtext}>Admin</Text>
						</Button>
					</Tooltip>
					<HeaderButton variant="notifications" />
				</Flex>
				<PageTabs
					tabs={[
						{
							label: t('components.header.admin.tabs.home.label'),
							href: '/dashboard/a',
							icon: <IconLayoutGrid size={14} />,
						},
						{
							label: t('components.header.admin.tabs.auctions.label'),
							href: '/dashboard/a/auctions',
							icon: <IconGavel size={14} />,
						},
						{
							label: t('components.header.admin.tabs.admins.label'),
							href: '/dashboard/a/admins',
							icon: <IconUsers size={14} />,
						},
						{
							label: t('components.header.admin.tabs.firms.label'),
							href: '/dashboard/a/firms',
							icon: <IconBuildings size={14} />,
						},
					]}
				/>
				<Flex className={classes.right}>
					<HeaderButton className={classes.search} variant="search" hiddenFrom="md" />
					<HeaderButton variant="accessibility" visibleFrom="xs" />
					<HeaderButton variant="language" visibleFrom="xs" />
					<HeaderButton variant="theme" visibleFrom="xs" />
					<UserProfile />
				</Flex>
			</Group>
		</Center>
	);
};
