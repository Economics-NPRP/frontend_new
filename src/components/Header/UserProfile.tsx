import { useTranslations } from 'next-intl';

import {
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
	Stack,
	Text,
} from '@mantine/core';
import {
	IconArrowUpRight,
	IconBookmark,
	IconCalendar,
	IconChartBar,
	IconCoins,
	IconHash,
	IconHelp,
	IconHistory,
	IconLayoutGrid,
	IconLeaf,
	IconLogout,
	IconSettings,
} from '@tabler/icons-react';

import { HeaderButton } from './HeaderButton';
import classes from './styles.module.css';

export const UserProfile = () => {
	const t = useTranslations();

	return (
		<Menu width={320} offset={4} position="bottom-end">
			<MenuTarget>
				<HeaderButton className={classes.user} variant="user" />
			</MenuTarget>

			<MenuDropdown className={classes.userDropdown}>
				<Container className={`${classes.bg} bg-grid-sm`} />
				<Avatar className={classes.avatar} name="John Doe" color="initials" size={'lg'} />
				<Group className={classes.details}>
					<Stack className={classes.id}>
						<Text className={classes.subtext}>
							<IconHash size={14} />{' '}
							{t('components.header.user.details.id', { id: 123456 })}
						</Text>
						<Text className={classes.text}>John Doe</Text>
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

				<MenuDivider />
				<MenuLabel>{t('components.header.user.marketplace')} </MenuLabel>
				<MenuItem component="a" href="" leftSection={<IconHistory size={16} />}>
					{t('components.header.user.bidding-history')}
				</MenuItem>
				<MenuItem component="a" href="" leftSection={<IconCalendar size={16} />}>
					{t('components.header.user.auction-calendar')}
				</MenuItem>
				<MenuItem leftSection={<IconBookmark size={16} />}>
					{t('components.header.user.saved-auctions')}
				</MenuItem>

				<MenuDivider />
				<MenuLabel>{t('components.header.user.dashboard')}</MenuLabel>
				<MenuItem component="a" href="" leftSection={<IconLayoutGrid size={16} />}>
					{t('components.header.user.my-dashboard')}
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
					{t('components.header.user.help-center')}
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
