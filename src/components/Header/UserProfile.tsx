'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useMemo } from 'react';

import { Id } from '@/components/Id';
import { Switch } from '@/components/SwitchCase';
import { MyUserProfileContext } from '@/contexts';
import { logout } from '@/lib/auth/logout';
import {
	ActionIconProps,
	Alert,
	Avatar,
	Container,
	Group,
	Menu,
	MenuDivider,
	MenuDropdown,
	MenuItem,
	MenuLabel,
	MenuTarget,
	Rating,
	Skeleton,
	Stack,
	Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
	IconArrowUpRight,
	IconBookmark,
	IconCalendar,
	IconChartBar,
	IconCoins,
	IconExclamationCircle,
	IconHelp,
	IconHistory,
	IconLayoutGrid,
	IconLeaf,
	IconLogout,
	IconSettings,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import { HeaderButton } from './HeaderButton';
import classes from './styles.module.css';

export interface UserProfileProps extends ActionIconProps {
	variant: 'marketplace' | 'adminDashboard';
}
export const UserProfile = ({ variant, className, ...props }: UserProfileProps) => {
	const t = useTranslations();
	const router = useRouter();
	const queryClient = useQueryClient();
	const myUser = useContext(MyUserProfileContext);

	//	Clear cookies and redirect to login page
	const handleLogout = useCallback(() => {
		logout()
			.then((res) => {
				if (res.ok) {
					queryClient.invalidateQueries({
						queryKey: ['users', 'mine'],
					});
					notifications.show({
						color: 'green',
						title: t('components.header.user.logout.success.title'),
						message: t('components.header.user.logout.success.message'),
						position: 'bottom-center',
					});
					router.push('/login');
				} else {
					const errorMessage = (res.errors || []).join(' ');
					console.error('Error logging out:', errorMessage);
					notifications.show({
						color: 'red',
						title: t('components.header.user.logout.error.title'),
						message: errorMessage,
						position: 'bottom-center',
					});
				}
			})
			.catch((err) => {
				console.error('Error logging out:', err);
				notifications.show({
					color: 'red',
					title: t('components.header.user.logout.error.title'),
					message: err.message ?? t('lib.unknownError'),
					position: 'bottom-center',
				});
			});
	}, [router]);

	const currentState = useMemo(() => {
		if (myUser.isError) return 'error';
		if (myUser.isSuccess) return 'success';
		return 'loading';
	}, [myUser]);

	return (
		<Menu width={320} offset={4} position="bottom-end">
			<MenuTarget>
				<HeaderButton
					className={`${classes.user} ${className}`}
					variant="user"
					{...props}
				/>
			</MenuTarget>

			<MenuDropdown
				className={`${classes.userDropdown} ${myUser.isLoading ? classes.loading : ''}`}
			>
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
							title={t('components.header.user.profile.error.title')}
							icon={<IconExclamationCircle />}
							className="mb-4"
						>
							{myUser.error?.message}
						</Alert>
					</Switch.Error>
					<Switch.Else>
						<Container className={`${classes.bg} bg-grid-sm`} />
						<Avatar
							className={classes.avatar}
							name={myUser.data.name}
							color="initials"
							size={'lg'}
						/>
						<Group className={classes.details}>
							<Stack className={classes.id}>
								<Id value={myUser.data.id} variant="company" truncate />
								<Text className={classes.text}>{myUser.data.name}</Text>
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
						<Switch value={variant}>
							<Switch.Case when="marketplace">
								<MenuItem
									classNames={{
										item: classes.primary,
										itemLabel: 'flex-none',
										itemSection: 'm-0',
									}}
									component={Link}
									href={`/dashboard/${myUser.data.type === 'admin' ? 'a' : 'f'}`}
									rightSection={<IconArrowUpRight size={16} />}
								>
									{t('components.header.user.profile.cta.dashboard')}
								</MenuItem>
							</Switch.Case>
							<Switch.Case when="adminDashboard">
								<MenuItem
									classNames={{
										item: classes.primary,
										itemLabel: 'flex-none',
										itemSection: 'm-0',
									}}
									component={Link}
									href="/marketplace"
									rightSection={<IconArrowUpRight size={16} />}
								>
									{t('components.header.user.profile.cta.marketplace')}
								</MenuItem>
							</Switch.Case>
						</Switch>
					</Switch.Else>
				</Switch>

				<MenuDivider />
				<MenuLabel>{t('components.header.user.marketplace')} </MenuLabel>
				<MenuItem component={Link} href="" leftSection={<IconHistory size={16} />} disabled>
					{t('components.header.user.biddingHistory')}
				</MenuItem>
				<MenuItem
					component={Link}
					href=""
					leftSection={<IconCalendar size={16} />}
					disabled
				>
					{t('components.header.user.auctionCalendar')}
				</MenuItem>
				<MenuItem leftSection={<IconBookmark size={16} />} disabled>
					{t('components.header.user.savedAuctions')}
				</MenuItem>

				<MenuDivider />
				<MenuLabel>{t('components.header.user.dashboard')}</MenuLabel>
				<MenuItem
					component={Link}
					href=""
					leftSection={<IconLayoutGrid size={16} />}
					disabled
				>
					{t('components.header.user.myDashboard')}
				</MenuItem>
				<MenuItem
					component={Link}
					href=""
					leftSection={<IconChartBar size={16} />}
					disabled
				>
					{t('components.header.user.statistics')}
				</MenuItem>
				<MenuItem component={Link} href="" leftSection={<IconCoins size={16} />} disabled>
					{t('components.header.user.transactions')}
				</MenuItem>
				<MenuItem component={Link} href="" leftSection={<IconLeaf size={16} />} disabled>
					{t('components.header.user.permits')}
				</MenuItem>

				<MenuDivider />
				<MenuItem component={Link} href="" leftSection={<IconHelp size={16} />} disabled>
					{t('components.header.user.helpCenter')}
				</MenuItem>
				<MenuItem
					component={Link}
					href=""
					leftSection={<IconSettings size={16} />}
					disabled
				>
					{t('components.header.user.settings')}
				</MenuItem>
				<MenuItem onClick={handleLogout} leftSection={<IconLogout size={16} />}>
					{t('components.header.user.logout.label')}
				</MenuItem>
			</MenuDropdown>
		</Menu>
	);
};
