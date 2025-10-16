'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { Id } from '@/components/Id';
import { Switch } from '@/components/SwitchCase';
import { IMyUserProfileContext } from '@/contexts';
import { useAuth } from '@/hooks';
import {
	Alert,
	Avatar,
	Container,
	Group,
	Menu,
	MenuDivider,
	MenuDropdown,
	MenuItem,
	MenuLabel,
	MenuProps,
	MenuTarget,
	Rating,
	Skeleton,
	Stack,
	Text,
} from '@mantine/core';
import {
	IconArrowUpRight,
	IconBookmark,
	IconBuildingSkyscraper,
	IconBuildingStore,
	IconCalendar,
	IconChartBar,
	IconExclamationCircle,
	IconGavel,
	IconHelp,
	IconHistory,
	IconLayoutGrid,
	IconLeaf,
	IconLogout,
	IconMessage,
	IconSettings,
	IconUsers,
} from '@tabler/icons-react';

import classes from './styles.module.css';

import { isolateMessage } from 'helpers/isolateMessage';

export interface MyProfileMenuProps extends MenuProps {
	myUser: IMyUserProfileContext;
	isAdmin: boolean;
	currentState: 'loading' | 'error' | 'success';
}
export const MyProfileMenu = ({ children, myUser, isAdmin, currentState, ...menuProps }: MyProfileMenuProps) => {
	const t = useTranslations();
	const pathname = usePathname();

	const { logout } = useAuth();

	useEffect(() => { console.log(myUser) }, [myUser]);

	const isMarketplace = useMemo(() => pathname.startsWith('/marketplace'), [pathname]);

	// Safeguard against undefined myUser
	const safeIsLoading = myUser?.isLoading ?? true;
	const safeError = myUser?.error;
	const safeData = myUser?.data ?? { id: '', name: '', type: 'firm' as const };

	return (
		<Menu
			classNames={{
				dropdown: `${classes.root} ${safeIsLoading ? classes.loading : ''}`,
				item: classes.item,
			}}
			width={320}
			offset={4}
			position="bottom-end"
			{...menuProps}
		>
			<MenuTarget>{children}</MenuTarget>

			<MenuDropdown>
				<Switch value={currentState}>
					<Switch.Loading>
						<Container className={`${classes.bg} bg-grid-sm`} />
						<Skeleton className={classes.avatar} circle />
						<Group className={classes.details}>
							<Stack className={classes.id}>
								<Skeleton className={classes.text} />
								<Skeleton className={classes.text} />
							</Stack>
							<Stack className={classes.rating}>
								<Rating
									className={classes.value}
									size={'xs'}
									value={0}
									fractions={3}
									readOnly
								/>
								<Skeleton className={classes.subtext} />
							</Stack>
						</Group>
					</Switch.Loading>
					<Switch.Error>
						<Alert
							variant="light"
							color="red"
							title={t('components.myProfileMenu.profile.error.title')}
							icon={<IconExclamationCircle />}
							className="mb-4"
						>
							{isolateMessage(safeError?.message || "")}
						</Alert>
					</Switch.Error>
					<Switch.Else>
						<Container className={`${classes.bg} bg-grid-sm`} />
						<Avatar
							className={classes.avatar}
							name={safeData.name}
							color="initials"
							size={'lg'}
						/>
						<Group className={classes.details}>
							<Stack className={classes.id}>
								<Id value={safeData.id} variant="company" truncate />
								<Text className={classes.text}>{safeData.name}</Text>
							</Stack>
							<Stack className={classes.rating}>
								<Rating
									className={classes.value}
									size={'xs'}
									value={4.25}
									fractions={3}
									readOnly
								/>
								<Text className={classes.subtext}>
									{t('constants.rating.medium', { rating: 4.2 })}
								</Text>
							</Stack>
						</Group>
						<MenuItem
							classNames={{
								item: classes.primary,
								itemLabel: 'flex-none',
								itemSection: 'm-0',
							}}
							component={Link}
							href={
								isMarketplace ? `/dashboard/${isAdmin ? 'a' : 'f'}` : '/marketplace'
							}
							rightSection={<IconArrowUpRight size={16} />}
						>
							{isMarketplace
								? t('components.myProfileMenu.profile.cta.dashboard')
								: t('components.myProfileMenu.profile.cta.marketplace')}
						</MenuItem>
					</Switch.Else>
				</Switch>

				<MenuDivider />
				<MenuLabel>{t('components.myProfileMenu.marketplace.label')} </MenuLabel>
				<MenuItem
					component={Link}
					href="/marketplace"
					leftSection={<IconBuildingStore size={16} />}
				>
					{t('components.myProfileMenu.marketplace.home')}
				</MenuItem>
				<MenuItem component={Link} href="" leftSection={<IconHistory size={16} />} disabled>
					{t('components.myProfileMenu.marketplace.biddingHistory')}
				</MenuItem>
				<MenuItem
					component={Link}
					href=""
					leftSection={<IconCalendar size={16} />}
					disabled
				>
					{t('components.myProfileMenu.marketplace.auctionCalendar')}
				</MenuItem>
				<MenuItem leftSection={<IconBookmark size={16} />} disabled>
					{t('components.myProfileMenu.marketplace.savedAuctions')}
				</MenuItem>

				<MenuDivider />
				<MenuLabel>{t('components.myProfileMenu.dashboard.label')}</MenuLabel>
				<MenuItem
					component={Link}
					href={isAdmin ? '/dashboard/a' : '/dashboard/f'}
					leftSection={<IconLayoutGrid size={16} />}
				>
					{t('components.myProfileMenu.dashboard.home')}
				</MenuItem>
				<MenuItem
					component={Link}
					href={`/dashboard/${isAdmin ? 'a' : 'f'}/statistics`}
					leftSection={<IconChartBar size={16} />}
				>
					{t('components.myProfileMenu.dashboard.statistics')}
				</MenuItem>
				<Switch value={safeData.type}>
					<Switch.Case when="admin">
						<MenuItem
							component={Link}
							href="/dashboard/a/cycles"
							leftSection={<IconGavel size={16} />}
						>
							{t('components.myProfileMenu.dashboard.admin.auctionsAndCycles')}
						</MenuItem>
						<MenuItem
							component={Link}
							href="/dashboard/a/admins"
							leftSection={<IconUsers size={16} />}
						>
							{t('components.myProfileMenu.dashboard.admin.admins')}
						</MenuItem>
						<MenuItem
							component={Link}
							href="/dashboard/a/firms"
							leftSection={<IconBuildingSkyscraper size={16} />}
						>
							{t('components.myProfileMenu.dashboard.admin.firms')}
						</MenuItem>
					</Switch.Case>
					<Switch.Else>
						<MenuItem
							component={Link}
							href="/dashboard/f/pe"
							leftSection={<IconLeaf size={16} />}
						>
							{t('components.myProfileMenu.dashboard.firm.carbon')}
						</MenuItem>
						<MenuItem
							component={Link}
							href="/dashboard/f/auctions"
							leftSection={<IconGavel size={16} />}
						>
							{t('components.myProfileMenu.dashboard.firm.economic')}
						</MenuItem>
					</Switch.Else>
				</Switch>

				<MenuDivider />
				<MenuItem component={Link} href="/feedback" leftSection={<IconMessage size={16} />}>
					{t('constants.pages.feedback.title')}
				</MenuItem>
				<MenuItem component={Link} href="/help" leftSection={<IconHelp size={16} />}>
					{t('constants.pages.help.title')}
				</MenuItem>
				<MenuItem
					component={Link}
					href={`/dashboard/${safeData.type === 'admin' ? 'a' : 'f'}/settings`}
					leftSection={<IconSettings size={16} />}
				>
					{t('constants.pages.settings.title')}
				</MenuItem>
				<MenuItem onClick={() => logout.mutate()} leftSection={<IconLogout size={16} />}>
					{t('components.myProfileMenu.logout')}
				</MenuItem>
			</MenuDropdown>
		</Menu>
	);
};
