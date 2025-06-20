'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';

import { PageDropdown } from '@/components/Header/PageDropdown';
import { PageTabs } from '@/components/Header/PageTabs';
import { Button, Center, Flex, Group, Text, Tooltip } from '@mantine/core';
import { IconBox, IconBuildings, IconGavel, IconLayoutGrid, IconUsers } from '@tabler/icons-react';

import { HeaderButton } from './HeaderButton';
import { UserProfile } from './UserProfile';
import classes from './styles.module.css';

export const AdminDashboardHeader = () => {
	const t = useTranslations();

	const pageMatcher = useMemo(
		() => (pathname: string) => {
			if (pathname.startsWith('/dashboard/a/auctions')) return 'auctions';
			if (pathname.startsWith('/dashboard/a/admins')) return 'admins';
			if (pathname.startsWith('/dashboard/a/firms')) return 'firms';
			return 'home';
		},
		[],
	);

	const pages = useMemo(
		() => [
			{
				key: 'home',
				label: t('components.header.admin.tabs.home.label'),
				href: '/dashboard/a',
				icon: <IconLayoutGrid size={14} />,
			},
			{
				key: 'auctions',
				label: t('components.header.admin.tabs.auctions.label'),
				href: '/dashboard/a/auctions',
				icon: <IconGavel size={14} />,
			},
			{
				key: 'admins',
				label: t('components.header.admin.tabs.admins.label'),
				href: '/dashboard/a/admins',
				icon: <IconUsers size={14} />,
			},
			{
				key: 'firms',
				label: t('components.header.admin.tabs.firms.label'),
				href: '/dashboard/a/firms',
				icon: <IconBuildings size={14} />,
			},
		],
		[t],
	);

	return (
		<Center component="header" className={classes.root}>
			<Group className={classes.container}>
				<Flex className={classes.left}>
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
							ETS <Text className={classes.subtext}>Admin</Text>
						</Button>
					</Tooltip>
					<PageDropdown pageMatcher={pageMatcher} pages={pages} />
					<HeaderButton variant="notifications" />
				</Flex>
				<PageTabs pageMatcher={pageMatcher} pages={pages} />
				<Flex className={classes.right}>
					<HeaderButton variant="accessibility" visibleFrom="xs" />
					<HeaderButton variant="language" visibleFrom="xs" />
					<HeaderButton variant="theme" visibleFrom="xs" />
					<UserProfile />
				</Flex>
			</Group>
		</Center>
	);
};
