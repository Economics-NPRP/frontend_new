import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Id } from '@/components/Id';
import { throwError } from '@/helpers';
import { getMyProfile } from '@/lib/users/firms';
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
	MenuTarget,
	Rating,
	Skeleton,
	Stack,
	Text,
} from '@mantine/core';
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
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { HeaderButton } from './HeaderButton';
import classes from './styles.module.css';

export const UserProfile = () => {
	const t = useTranslations();

	//	TODO: invalidate data when the user logs in or out
	const {
		data: userData,
		error: userDataError,
		isLoading: isUserDataLoading,
		isError: isUserDataError,
		isSuccess: isUserDataSuccess,
	} = useQuery({
		queryKey: ['users', 'firms', 'mine'],
		queryFn: () => throwError(getMyProfile()),
		placeholderData: keepPreviousData,
	});

	useEffect(() => console.log('User Data:', userData), [userData]);

	const profileLoading = (
		<>
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
		</>
	);

	const profileError = (
		<Alert
			variant="light"
			color="red"
			title="There was an error displaying your profile"
			icon={<IconExclamationCircle />}
			className="mb-4"
		>
			{userDataError?.message}
		</Alert>
	);

	const profileDetails = (
		<>
			<Container className={`${classes.bg} bg-grid-sm`} />
			<Avatar className={classes.avatar} name={userData?.name} color="initials" size={'lg'} />
			<Group className={classes.details}>
				<Stack className={classes.id}>
					<Id value={userData?.id || ''} variant="company" truncate />
					<Text className={classes.text}>{userData?.name}</Text>
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
						{t('components.header.user.details.rating', { rating: 4.2 })}
					</Text>
				</Stack>
			</Group>
			<MenuItem
				classNames={{
					item: classes.primary,
					itemLabel: 'flex-none',
					itemSection: 'm-0',
				}}
				component="a"
				href="/dashboard/profile"
				rightSection={<IconArrowUpRight size={16} />}
			>
				{t('components.header.user.profile')}
			</MenuItem>
		</>
	);

	return (
		<Menu width={320} offset={4} position="bottom-end">
			<MenuTarget>
				<HeaderButton className={classes.user} variant="user" />
			</MenuTarget>

			<MenuDropdown
				className={`${classes.userDropdown} ${isUserDataLoading ? classes.loading : ''}`}
			>
				{isUserDataLoading && profileLoading}
				{!isUserDataLoading && !isUserDataError && !isUserDataSuccess && profileLoading}
				{isUserDataError && profileError}
				{isUserDataSuccess && profileDetails}

				<MenuDivider />
				<MenuLabel>{t('components.header.user.marketplace')} </MenuLabel>
				<MenuItem component="a" href="" leftSection={<IconHistory size={16} />}>
					{t('components.header.user.biddingHistory')}
				</MenuItem>
				<MenuItem component="a" href="" leftSection={<IconCalendar size={16} />}>
					{t('components.header.user.auctionCalendar')}
				</MenuItem>
				<MenuItem leftSection={<IconBookmark size={16} />}>
					{t('components.header.user.savedAuctions')}
				</MenuItem>

				<MenuDivider />
				<MenuLabel>{t('components.header.user.dashboard')}</MenuLabel>
				<MenuItem component="a" href="" leftSection={<IconLayoutGrid size={16} />}>
					{t('components.header.user.myDashboard')}
				</MenuItem>
				<MenuItem component="a" href="" leftSection={<IconChartBar size={16} />}>
					{t('components.header.user.statistics')}
				</MenuItem>
				<MenuItem component="a" href="" leftSection={<IconCoins size={16} />}>
					{t('components.header.user.transactions')}
				</MenuItem>
				<MenuItem component="a" href="" leftSection={<IconLeaf size={16} />}>
					{t('components.header.user.permits')}
				</MenuItem>

				<MenuDivider />
				<MenuItem component="a" href="" leftSection={<IconHelp size={16} />}>
					{t('components.header.user.helpCenter')}
				</MenuItem>
				<MenuItem component="a" href="" leftSection={<IconSettings size={16} />}>
					{t('components.header.user.settings')}
				</MenuItem>
				<MenuItem leftSection={<IconLogout size={16} />}>
					{t('components.header.user.logout')}
				</MenuItem>
			</MenuDropdown>
		</Menu>
	);
};
